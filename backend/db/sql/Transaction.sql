CREATE TYPE Direction AS ENUM('IN', 'OUT');
CREATE TYPE TokenType AS ENUM('ERC20', 'ERC721');

CREATE TABLE IF NOT EXISTS Transaction (
    account VARCHAR(42) NOT NULL,
    counterparty VARCHAR(42) NOT NULL,
    block_num INT NOT NULL,
    direction Direction NOT NULL,
    net_amount TEXT NOT NULL,
    timestamp INT NOT NULL,
    token_address TEXT NOT NULL,
    token_id TEXT,
    token_type TokenType NOT NULL,
    txn_hash TEXT NOT NULL,
    log_index TEXT NOT NULL,
    UNIQUE(account, counterparty, block_num, direction, net_amount, timestamp, token_address, token_id, token_type, txn_hash, log_index)
);