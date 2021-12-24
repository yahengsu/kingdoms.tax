// db/db_service.go
// Service Handles all communication with mongodb database

package db

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	PAGE_SIZE = 10
)

type DBConnection struct {
	conn *mongo.Client
	coll *mongo.Collection
}

var client DBConnection

/*
	Creates MongoClient object.
	Returns:
		* nil if success
		* error if fail
*/
func InitMongoClient(uri string) error {
	new_conn, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		return err
	}
	// Set client struct
	client.conn = new_conn
	client.coll = client.conn.Database("dfk-txns").Collection("txns")
	return nil
}

/*
	Get all transactions for specific account
	sorted from oldest to newest
	Returns:
		* ([]Transaction, nil) if success
		* (nil, error) if fail
*/
func GetAllTxns(address string) ([]Transaction, error) {
	txns_res := []Transaction{}
	return txns_res, nil
}

/*
	Get transactions for specific account between Unix time start and end
	sorted from oldest to newest.
	Returns:
		* ([]Transaction, nil) if success
		* (nil, error) if fail
*/
func GetTxnsBetweenTimes(start, end int64) ([]Transaction, error) {

	return nil, nil
}

/*
	Sorts received txns args and appends to specific account
	Returns: nil if success, error if fail
*/
func AppendMultipleTxn(txns []Transaction) error {
	return nil
}

/*
	Append single transaction to specific account
	Returns: nil if success, error if fail
*/
func AppendSingleTxn(txn Transaction) error {
	return nil
}

/*
	Create document for new account
	Returns: nil if success, error if fail
*/
func InsertNewAccount(address string) error {
	return nil
}

func performAggregation(pipeline mongo.Pipeline) error {
	return nil
}
