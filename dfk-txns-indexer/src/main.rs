use anyhow::Result;
use ethers::prelude::LogMeta;
use ethers::providers::{Http, Middleware, Provider};
use ethers::types::{Filter, Log, ValueOrArray};
use ethers::{
    core::abi::{Abi, EventExt},
    types::H160,
};
use serde::{Deserialize, Serialize};
use std::env;
use std::fs;
use std::sync::Arc;
use std::{collections::HashMap, convert::TryFrom, str::FromStr};

use ethers::contract::EthEvent;
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

const BLOCKS_PER_REQ: i32 = 100;

#[derive(Serialize, Deserialize)]
enum DfkTransfer {
    Erc20(Erc20::TransferFilter),
    Erc721(Erc721::TransferFilter),
}

#[tokio::main]
async fn main() -> Result<()> {
    let args: Vec<String> = env::args().collect();

    // TODO: Instead of a manually set start block, get latest processed block from DB service.
    let mut start_block = 20870000;
    if args.len() > 1 && args[1] == "startBlock" {
        start_block = args[2].parse::<i32>().expect(
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
    let abi_path = "./constants/abis.json";

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

    let selection = start_block..start_block + 100;

    let erc20 = Erc20::Erc20::new(H160::zero(), provider.clone());
    let mut erc20_transfer_filter = erc20.transfer_filter();
    erc20_transfer_filter.filter = erc20_transfer_filter
        .filter
        .select(selection.clone())
        .address(ValueOrArray::Array(erc20s));

    let mut transfers: Vec<(DfkTransfer, LogMeta)> = erc20_transfer_filter
        .query_with_meta()
        .await?
        .into_iter()
        .map(|(t, meta)| (DfkTransfer::Erc20(t), meta))
        .collect();

    let erc721 = Erc721::Erc721::new(H160::zero(), provider.clone());
    let mut erc721_transfer_filter = erc721.transfer_filter();
    erc721_transfer_filter.filter = erc721_transfer_filter
        .filter
        .select(selection)
        .address(ValueOrArray::Array(erc721s));

    transfers.extend(
        erc721_transfer_filter
            .query_with_meta()
            .await?
            .into_iter()
            .map(|(t, meta)| (DfkTransfer::Erc721(t), meta)),
    );

    //TODO: Run this periodically, increasing filter blockrange by BLOCKS_PER_REQ until we reach current block.
    index_txns_in_filter(&transfers).await?;
    Ok(())
}

async fn index_txns_in_filter(logs: &Vec<(DfkTransfer, LogMeta)>) -> Result<()> {
    Ok(push_txns_to_mongo_service(format_logs(logs)).await?)
}

async fn push_txns_to_mongo_service(logs: serde_json::Value) -> Result<()> {
    //TODO: Push valid transactions to Rick's mongo service once it's ready
    //
    println!("{}", logs);
    Ok(())
}

fn format_logs(logs: &Vec<(DfkTransfer, LogMeta)>) -> serde_json::Value {
    //TODO: Format these into json to send to Rick's mongo service

    let mut transfers = vec![];
    for (transfer, meta) in logs.iter() {
        println!("{:?}", meta);
        println!("txn hash: {:?}", meta.transaction_hash);

        /*
        match transfer {
            DfkTransfer::Erc20(Erc20::TransferFilter { from, to, value }) => todo!(),
            DfkTransfer::Erc721(Erc721::TransferFilter { from, to, token_id }) => todo!(),
        }
         */

        transfers.push(transfer.clone());
    }

    serde_json::to_value(&transfers).unwrap()
}
