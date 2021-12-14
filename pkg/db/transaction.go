// db/transaction.go
// Defines the Transaction type for interaction with mongodb

package db

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Account struct {
	Id      primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Address string             `json:"address" bson:"address"` // don't know if we need this
	Txns    []Transaction      `json:"transactions" bson:"transactions"`
}

type Transaction struct {
	BlockHash string `json:"blockHash" bson:"blockHash"`
	BlockNum  int    `json:"blockNumber" bson:"blockNumber"`
	From      string `json:"from" bson:"from"`
	Timestamp int64  `json:"timestamp" bson:"timestamp"`
	Gas       int    `json:"gas" bson:"gas"`
	GasPrice  int    `json:"gasPrice" bson:"gasPrice"`
	Hash      string `json:"hash" bson:"hash"`
	Input     string `json:"input" bson:"input"`
	Nonce     int    `json:"nonce" bson:"nonce"`
	To        string `json:"to" bson:"to"`
	TxnIndex  int    `json:"transactionIndex" bson:"transactionIndex"`
	Value     int    `json:"value" bson:"value"`
	ShardID   int    `json:"shardID" bson:"shardID"`
	ToShardID int    `json:"toShardID" bson:"toShardID"`
}
