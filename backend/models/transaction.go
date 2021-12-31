package models

// Transaction is the database representation of a single DFK transaction.
type Transaction struct {
	BlockNum  int    `json:"block_number" bson:"block_number"`
	Direction string `json:"direction" bson:"direction"`
	NetAmount int    `json:"net_amount" bson:"net_amount"`
	Timestamp int    `json:"timestamp" bson:"timestamp"`
	TokenAddr string `json:"token_addr" bson:"token_addr"`
	TokenID   string `json:"token_id" bson:"token_id"`
	TokenType string `json:"token_type" bson:"token_type"`
	TxnHash   string `json:"txn_hash" bson:"txn_hash"`
}
