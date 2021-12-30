use anyhow::Result;
use ethers::prelude::{LogMeta, Middleware, TxHash, U256, U64};
use ethers::providers::{Http, Provider};
use ethers::types::ValueOrArray;
use ethers::{core::abi::Abi, types::H160};
use futures::future::try_join_all;
use serde::{Deserialize, Serialize};
use std::env;
use std::fs;
use std::ops::Range;
use std::sync::Arc;
use std::{collections::HashMap, convert::TryFrom, str::FromStr};
use tokio::try_join;

mod contracts;

use contracts::Erc20;
use contracts::Erc721;

#[derive(Serialize, Deserialize)]
struct AbiJson {
    erc20: Abi,
    erc721: Abi,
}

#[derive(Serialize, Deserialize)]
struct ContractJson {
    erc20: HashMap<String, String>,
    erc721: HashMap<String, String>,
    other: HashMap<String, String>,
}

const BLOCKS_PER_REQ: u64 = 1;

#[derive(Serialize, Deserialize)]
enum DfkTransfer {
    Erc20(Erc20::TransferFilter),
    Erc721(Erc721::TransferFilter),
}

#[derive(Serialize, Deserialize)]
enum Direction {
    IN,
    OUT,
}

#[derive(Serialize, Deserialize)]
enum TokenType {
    ERC20,
    ERC721,
}

#[derive(Serialize, Deserialize)]
struct DfkTransaction {
    txn_hash: TxHash,
    account: H160,
    token_addr: H160,
    net_amount: U256,
    block_number: u64,
    timestamp: u64,
    direction: Direction,
    token_type: TokenType,
    token_id: Option<U256>, // token_id for erc721 NFT transfers
}

#[tokio::main]
async fn main() -> Result<()> {
    let args: Vec<String> = env::args().collect();

    // TODO: Instead of a manually set start block, get latest processed block from DB service.
    let mut start_block: u64 = 20870000;
    if args.len() > 1 && args[1] == "startBlock" {
        start_block = args[2].parse::<u64>().expect(
            "\n
        Error reading command line args\n
        Usage:\n
        cargo run\n
        cargo run -- --startBlock <number>\n
        ",
        );
    }

    // Define paths to contract json
    let contracts_path = "./constants/contracts.json";

    // Parse out contracts to handle
    let contracts_data = fs::read_to_string(contracts_path).expect("unable to read contracts file");
    let contracts: ContractJson =
        serde_json::from_str(&contracts_data).expect("Couldn't read contracts json string");
    let erc20s: Vec<H160> = contracts
        .erc20
        .into_values()
        .map(|s| H160::from_str(&s).expect("Error converting addr string to H160"))
        .collect();
    let erc721s: Vec<H160> = contracts
        .erc721
        .into_values()
        .map(|s| H160::from_str(&s).expect("Error converting addr string to H160"))
        .collect();

    // Activate harmony provider
    let provider = Arc::new(
        Provider::<Http>::try_from("https://api.s0.t.hmny.io")
            .expect("Could not instantiate HTTP Provider"),
    );

    index_txns_to_end_block(start_block, erc20s, erc721s, provider).await?;
    Ok(())
}

// Attempts to index transactions up to a relatively recent block.
async fn index_txns_to_end_block(
    mut start_block: u64,
    erc20s: Vec<H160>,
    erc721s: Vec<H160>,
    provider: Arc<Provider<Http>>,
) -> Result<()> {
    let last_block = provider.get_block_number().await?.as_u64();

    let erc20 = Erc20::Erc20::new(H160::zero(), provider.clone());
    let mut erc20_transfer_filter = erc20.transfer_filter();
    erc20_transfer_filter.filter = erc20_transfer_filter
        .filter
        .address(ValueOrArray::Array(erc20s));

    let erc721 = Erc721::Erc721::new(H160::zero(), provider.clone());
    let mut erc721_transfer_filter = erc721.transfer_filter();
    erc721_transfer_filter.filter = erc721_transfer_filter
        .filter
        .address(ValueOrArray::Array(erc721s));

    while start_block < last_block - BLOCKS_PER_REQ {
        // Set new selection on filters
        let selection = start_block..start_block + BLOCKS_PER_REQ;
        erc721_transfer_filter.filter = erc721_transfer_filter.filter.select(selection.clone());
        erc20_transfer_filter.filter = erc20_transfer_filter.filter.select(selection.clone());

        // Get block timestamps for this range
        let block_ts_map = get_block_timestamps(
            start_block..start_block + BLOCKS_PER_REQ + 1, // ethers-rs filter treats ranges as INCLUSIVE while querying for blocks is exclusive so we add 1.
            provider.clone(),
        )
        .await?;
        // Query transfers in parallel
        let erc20_transfers = erc20_transfer_filter.query_with_meta();
        let erc721_transfers = erc721_transfer_filter.query_with_meta();
        let raw_transfers = try_join!(erc20_transfers, erc721_transfers)?;

        let mut transfers: Vec<(DfkTransfer, LogMeta)> = raw_transfers
            .0
            .into_iter()
            .map(|(t, meta)| (DfkTransfer::Erc20(t), meta))
            .collect();

        transfers.extend(
            raw_transfers
                .1
                .into_iter()
                .map(|(t, meta)| (DfkTransfer::Erc721(t), meta)),
        );

        push_txns_to_mongo_service(&transfers, block_ts_map).await?;
        println!(
            "Finished pushing txns to mongo service for block range:{:?} {:?}",
            start_block,
            start_block + BLOCKS_PER_REQ
        );

        start_block += BLOCKS_PER_REQ;
        break; // Remove when actually indexing
    }
    Ok(())
}

async fn get_block_timestamps(
    selection: Range<u64>,
    provider: Arc<Provider<Http>>,
) -> Result<HashMap<U64, u64>> {
    // Grab block data for all blocks in range so we can add timestamps
    let blocks_futures = selection.map(|i| provider.get_block(i));
    let blocks_data = try_join_all(blocks_futures).await?;
    let mut blocks_map = HashMap::<U64, u64>::new();
    for maybe_block in blocks_data {
        let block = maybe_block.expect("Missing block!");
        blocks_map.insert(
            block.number.expect("Missing block number!"),
            block.timestamp.as_u64(),
        );
    }
    return Ok(blocks_map);
}

async fn push_txns_to_mongo_service(
    logs: &Vec<(DfkTransfer, LogMeta)>,
    block_ts_map: HashMap<U64, u64>,
) -> Result<()> {
    let api_url = env::var("INDEXER_API_URL")?;
    let logs_json = marshall_logs_to_json(logs, block_ts_map);
    let response = reqwest::Client::new()
        .post(&api_url)
        .json(&logs_json)
        .send()
        .await?;
    Ok(())
}

fn marshall_logs_to_json(
    logs: &Vec<(DfkTransfer, LogMeta)>,
    block_ts_map: HashMap<U64, u64>,
) -> serde_json::Value {
    let mut transfers: Vec<DfkTransaction> = vec![];
    for (transfer, meta) in logs.iter() {
        let ts = *block_ts_map
            .get(&meta.block_number)
            .expect("Missing block number while formatting transfer");
        let block_num = meta.block_number.as_u64();
        match transfer {
            DfkTransfer::Erc20(Erc20::TransferFilter { from, to, value }) => {
                transfers.push(DfkTransaction {
                    txn_hash: meta.transaction_hash,
                    account: from.clone(),
                    token_addr: meta.address,
                    net_amount: value.clone(),
                    block_number: block_num,
                    timestamp: ts,
                    direction: Direction::OUT,
                    token_type: TokenType::ERC20,
                    token_id: None,
                });
                transfers.push(DfkTransaction {
                    txn_hash: meta.transaction_hash,
                    account: to.clone(),
                    token_addr: meta.address,
                    net_amount: value.clone(),
                    block_number: block_num,
                    timestamp: ts,
                    direction: Direction::IN,
                    token_type: TokenType::ERC20,
                    token_id: None,
                });
            }
            DfkTransfer::Erc721(Erc721::TransferFilter { from, to, token_id }) => {
                transfers.push(DfkTransaction {
                    txn_hash: meta.transaction_hash,
                    account: from.clone(),
                    token_addr: meta.address,
                    net_amount: U256::from_dec_str("1").expect("Error converting to U256"),
                    block_number: block_num,
                    timestamp: ts,
                    direction: Direction::OUT,
                    token_type: TokenType::ERC721,
                    token_id: Some(token_id.clone()),
                });
                transfers.push(DfkTransaction {
                    txn_hash: meta.transaction_hash,
                    account: to.clone(),
                    token_addr: meta.address,
                    net_amount: U256::from_dec_str("1").expect("Error converting to U256"),
                    block_number: block_num,
                    timestamp: ts,
                    direction: Direction::IN,
                    token_type: TokenType::ERC721,
                    token_id: Some(token_id.clone()),
                });
            }
        }
    }

    serde_json::to_value(&transfers).unwrap()
}
