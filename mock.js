db = connect("localhost:27017/dfk-txns");
db.dropDatabase();

let timestamp = 0;

for (let i = 0; i < 5; i++) {
  let account = {address: "0x" + i, txns:null};
  let txns = [];
  for (let j = 0; j < 15; j++) {
    let single_txn = {
      blockHash: "0x" + j,
      blockNumber: j,
      timestamp: timestamp,
      from: account["address"],
      to: "0x" + j,
      gas: j,
      gasPrice: j,
      hash: "0x" + j,
      input: "0x" + j,
      nonce: j,
      transactionIndex: j,
      value: j,
      shardID: j % 4,
      toShardID: j % 4
    };
    txns.push(single_txn);
    timestamp += Math.ceil(Math.random() * 5);
  };
  timestamp = 0;
  account["txns"] = txns;
  db.txns.insertOne(account);
};
