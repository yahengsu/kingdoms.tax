// db/db_service.go
// Service Handles all communication with mongodb database

package db

import (
	"context"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const ()

//var client *mongo.Client // is this the best way to track mongo connection?

/*
	Creates MongoClient object.
	Returns:
		* nil if success
		* error if fail
*/
func InitMongoClient(uri string) *mongo.Client {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		panic(err)
	}
	return client
}

/*
	Get all transactions for specific account
	sorted from oldest to newest
	Returns:
		* ([]Transaction, nil) if success
		* (nil, error) if fail
*/
func GetAllTxns(address string) ([]Transaction, error) {
	return nil, nil
}

/*
	Get transactions for specific account between Unix time start and end
	sorted from oldest to newest.
	Returns:
		* ([]Transaction, nil) if success
		* (nil, error) if fail
*/
// db.txns.Find({"timestamp": {"$gte": start, "$lte": end}}).Sort()
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

// MongoDB Find examble
/*
	result, err := client.Database("dfk-txns").Collection("txns").Find(context.Background(), bson.M{"address": "0x0"})
	if err != nil {
		panic(err)
	}

	for result.Next(context.Background()) {
		fmt.Printf("%v", result.Current)
	}
*/
