// db/db_service.go
// Service Handles all communication with mongodb database

package db

import (
	"context"
	"encoding/json"
	"log"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DBConnection struct {
	init bool
	conn *mongo.Client
	coll *mongo.Collection
}

var client DBConnection

/*
	Creates MongoClient object.
	Returns: nil if success; error if fail
*/
func InitMongoClient(uri string) error {
	new_conn, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		return err
	}
	// Set client struct
	client = DBConnection{
		init: true,
		conn: new_conn,
		coll: new_conn.Database("dfk-txns").Collection("txns"),
	}
	return nil
}

/*
	For specified account and dates, get num of transactions and num pages.
	Returns:
		(txn_count, page_count) if success
		(0, 0) if fail
*/
func GetAccountStats(address string, start, end int64) (int, int) {
	return 0, 0
}

/*
	Get all transactions for specific account; sorted old to new
	Returns:
		([]Transaction, nil) if success
		(nil, error) if fail
*/
func GetAllTxns(address string) ([]Transaction, error) {
	txns_res := []Transaction{}
	return txns_res, nil
}

/*
	Get transactions between time start and end; sorted old to new.
	Returns:
		([]byte, nil) if success
		(nil, error) if fail
*/
func GetTxnsBetweenTimes(address string, start, end int64) ([]byte, error) {
	// Aggregation pipes
	addressMatch := genAddressMatch(address)
	unwindTxns := genUnwind()
	timeFilter := genTimeFilter(start, end)
	group := genGroupFilter()

	pipe := mongo.Pipeline{addressMatch, unwindTxns, timeFilter, group}

	cursor, err := performAggregation(pipe)
	if err != nil {
		return nil, err
	}

	var txn TxnWrapper
	cursor.Next(context.TODO())
	cursor.Decode(&txn)

	return json.Marshal(txn.Txns)
}

/*
	Sorts new txns and appends to address
	Returns: nil if success, error if fail
*/
func AppendTxns(address string, txns []Transaction) error {
	return nil
}

/*
	Create document for new account
	Returns: nil if success, error if fail
*/
func InsertNewAccount(address string) error {
	new_acc := Account{
		Address: address,
		Txns:    []Transaction{},
	}

	res, err := performInsert([]interface{}{new_acc})
	if err != nil {
		return err
	}
	log.Printf("Inserted new account with id: %v", res.InsertedIDs...)

	return nil
}

// Generic mongo insert function
func performInsert(docs []interface{}) (*mongo.InsertManyResult, error) {
	res, err := client.coll.InsertMany(context.TODO(), docs)
	if err != nil {
		return nil, err
	}
	return res, nil
}

// Generic aggregation function
func performAggregation(pipe mongo.Pipeline) (*mongo.Cursor, error) {
	cursor, err := client.coll.Aggregate(context.TODO(), pipe)
	if err != nil {
		return nil, err
	}
	return cursor, nil
}
