// db/transaction.go
// Defines all structs used for transaction and accounts

package db

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const (
	PAGE_SIZE = 10
)

// Used internally to keep track of db connection
type DBConnection struct {
	init bool
	conn *mongo.Client
	coll *mongo.Collection
}

// Used internally to pass paged items back to API
type PagedTxns struct {
	Txns       []Transaction
	Total      int64 // Total number of transactions returned
	TotalPages int   // Total number of pages
	Page       int   // Current page of transactions
}

// Transaction wrapper
type TxnWrapper struct {
	Txns []Transaction `json:"txns" bson:"txns"`
}

// Account with transactions
type Account struct {
	Id      primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"` // don't know if we need this
	Address string             `json:"address" bson:"address"`
	Txns    []Transaction      `json:"transactions" bson:"transactions"`
}

// Single transaction
type Transaction struct {
	BlockHash string `json:"blockHash" bson:"blockHash"`
	BlockNum  uint64 `json:"blockNumber" bson:"blockNumber"`
	From      string `json:"from" bson:"from"`
	Timestamp uint64 `json:"timestamp" bson:"timestamp"`
	Gas       uint64 `json:"gas" bson:"gas"`
	GasPrice  uint64 `json:"gasPrice" bson:"gasPrice"`
	Hash      string `json:"hash" bson:"hash"`
	Input     string `json:"input" bson:"input"`
	Nonce     uint64 `json:"nonce" bson:"nonce"`
	To        string `json:"to" bson:"to"`
	TxnIndex  uint   `json:"transactionIndex" bson:"transactionIndex"`
	Value     uint64 `json:"value" bson:"value"`
	ShardID   uint   `json:"shardID" bson:"shardID"`
	ToShardID uint   `json:"toShardID" bson:"toShardID"`
}
