use anyhow::Result;
use ethers::providers::{Http, Middleware, Provider};
use ethers::types::{Filter, Log, ValueOrArray};
use ethers::{
    core::abi::{Abi, EventExt},
    types::H160,
};
use serde::{Deserialize, Serialize};
use std::env;
use std::fs;
use std::{collections::HashMap, convert::TryFrom, str::FromStr};

mod contracts;

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

    // Parse out ABIs for contracts
    let abi_data = fs::read_to_string(abi_path).expect("unable to read abi file");
    let abis: AbiJson = serde_json::from_str(&abi_data).expect("Couldn't read abi json string");

    // Activate harmony provider
    let provider = Provider::<Http>::try_from("https://api.s0.t.hmny.io")
        .expect("Could not instantiate HTTP Provider");

    // Get transfer events from the ABIs
    let erc20_transfer = abis.erc20.event("Transfer")?;
    let erc721_transfer = abis.erc721.event("Transfer")?;

    let erc20_filter = Filter::new()
        .select(start_block..)
        .event(&erc20_transfer.abi_signature())
        .address(ValueOrArray::Array(erc20s));

    let erc721_filter = Filter::new()
        .select(start_block..)
        .event(&erc721_transfer.abi_signature())
        .address(ValueOrArray::Array(erc721s));

    //TODO: Run this periodically, increasing filter blockrange by BLOCKS_PER_REQ until we reach current block.
    index_txns_in_filter(erc20_filter, &provider, String::from("erc20")).await?;
    index_txns_in_filter(erc721_filter, &provider, String::from("erc721")).await?;
    Ok(())
}

async fn index_txns_in_filter(
    filter: Filter,
    provider: &Provider<Http>,
    abi_type: String,
) -> Result<()> {
    let logs = provider.get_logs(&filter).await?;
    Ok(push_txns_to_mongo_service(format_logs(logs, abi_type)).await?)
}

async fn push_txns_to_mongo_service(logs: serde_json::Value) -> Result<()> {
    //TODO: Push valid transactions to Rick's mongo service once it's ready
    println!("{:?}", logs);
    Ok(())
}

fn format_logs(logs: Vec<Log>, abi_type: String) -> serde_json::Value {
    //TODO: Format these into json to send to Rick's mongo service
    for log in logs.iter() {
        println!("{:?}", log);
        println!("txn hash: {:?}", log.transaction_hash);
        println!("txn from: {:?}", log.topics[1]);
        println!("txn to: {:?}", log.topics[2]);
        if abi_type == "erc20" {
            println!("amt: {}", log.data.to_string());
        } else if abi_type == "erc721" {
            println!("id: {:?}", log.topics[3]);
        }
    }
    serde_json::from_str("{}").expect("lol")
}
