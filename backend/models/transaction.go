package models

// Transaction is the database representation of a single DFK transaction.
type Transaction struct {
	Account      string `json:"account"`
	BlockNum     int    `json:"block_number"`
	CounterParty string `json:"counterparty"`
	Direction    string `json:"direction"`
	LogIndex     string `json:"log_index"`
	NetAmount    string `json:"net_amount"`
	Timestamp    int    `json:"timestamp"`
	TokenAddr    string `json:"token_addr"`
	TokenID      string `json:"token_id"`
	TokenType    string `json:"token_type"`
	TxnHash      string `json:"txn_hash"`
}
