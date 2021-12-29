// db/transaction.go
// Defines all structs used for transaction and accounts

package db

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const (
	PAGE_SIZE = 5
)

// Used internally to keep track of db connection
type DBConnection struct {
	init     bool
	conn     *mongo.Client
	txns     *mongo.Collection
	accounts *mongo.Collection
}

// Used internally to pass paged items back to API
type PagedTxn struct {
	Txns []Transaction `json:"txns" bson:"txns"`
	Page int           // Current page of transactions
}

// Tracks all addresses stored in db
type AddressBook struct {
	Id        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Addresses []string           `json:"addresses" bson:"addresses"`
}

// Account with transactions
type Account struct {
	Id      primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"` // don't know if we need this
	Address string             `json:"address" bson:"address"`
	Txns    []Transaction      `json:"transactions" bson:"transactions"`
}

// Single transaction
type Transaction struct {
	BlockNum  int    `json:"block_number" bson:"block_number"`
	Direction string `json:"direction" bson:"direction"`
	NetAmount string `json:"net_amount" bson:"net_amount"`
	Timestamp int    `json:"timestamp" bson:"timestamp"`
	TokenAddr string `json:"token_addr" bson:"token_addr"`
	TokenID   string `json:"token_id" bson:"token_id"`
	TokenType string `json:"token_type" bson:"token_type"`
	TxnHash   string `json:"txn_hash" bson:"txn_hash"`
}
