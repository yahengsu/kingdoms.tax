db = connect("192.168.1.84:27017/dfk-txns");
db.dropDatabase();

let timestamp = 0;

const shuffleArray = arr => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

for (let i = 0; i < 1; i++) {
  let account = {address: "0x" + i, txns:null};
  let txns = [];
  for (let j = 0; j < 10; j++) {
    let single_txn = {
      block_number: j,
      direction: (j%2 == 0) ? "IN" : "OUT",
      net_amount: "0x0"+j,
      timestamp: timestamp,
      token_addr: "0x" + j,
      token_id: "0x" + j,
      token_type: 'ERC20',
      txn_hash: "0x" + j,
    }
    txns.push(single_txn);
    timestamp += Math.ceil(Math.random() * 5);
  };
  timestamp = 0;
  account["txns"] = shuffleArray(txns);
  db.txns.insertOne(account);
};

