use clap::{Parser, Subcommand};
use ethers::prelude::*;

#[derive(Parser)]
#[clap(version = "1.0", author = "Aiden Benner")]
struct Opts {
    #[clap(subcommand)]
    subcmd: SubCommand,
}

#[derive(Subcommand)]
enum SubCommand {
    ConvertAbi(ConvertAbi),
}

#[derive(Parser)]
struct ConvertAbi {
    contract_name: String,
    abi_path: String,
    out_path: String,
}

fn main() -> anyhow::Result<()> {
    let opts = Opts::parse();

    match opts.subcmd {
        SubCommand::ConvertAbi(ConvertAbi {
            contract_name,
            abi_path,
            out_path,
        }) => {
            Abigen::new(&contract_name, abi_path)?
                .generate()?
                .write_to_file(out_path)?;
        }
    }

    Ok(())
}
