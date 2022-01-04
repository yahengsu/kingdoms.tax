package models

// Transaction is the database representation of a single DFK transaction.
type Transaction struct {
	Account      string  `json:"account"`
	CounterParty string  `json:"counterparty"`
	BlockNum     int     `json:"block_number"`
	Direction    string  `json:"direction"`
	NetAmount    string  `json:"net_amount"`
	Timestamp    int     `json:"timestamp"`
	TokenAddr    string  `json:"token_addr"`
	TokenID      string  `json:"token_id"`
	TokenType    string  `json:"token_type"`
	TxnHash      string  `json:"txn_hash"`
	LogIndex     string  `json:"log_index"`
	Price        float64 `json:"price"`
}
