// db/transaction.go
/* Defines:
* Accounts - a collection of stored accounts
* Account - Specific account with all txns
* Transaction - a transaction object
 */

package db

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Addresses struct {
	Id    primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"` // don't know if we need this
	Addrs []string           `json:"addresses" bson:"addresses"`
}

type Account struct {
	Id      primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"` // don't know if we need this
	Address string             `json:"address" bson:"address"`
	Txns    []Transaction      `json:"transactions" bson:"transactions"`
}

type Transaction struct {
	BlockHash string `json:"blockHash" bson:"blockHash"`
	BlockNum  uint64  `json:"blockNumber" bson:"blockNumber"`
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
