// db/db_service.go
// Service Handles all communication with mongodb database

package db

import (
	"context"
	"log"
	"math"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

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
		init:     true,
		conn:     new_conn,
		txns:     new_conn.Database("dfk-txns").Collection("txns"),
		accounts: new_conn.Database("dfk-txns").Collection("accounts"),
	}
	return nil
}

/*
	For specified account and dates, get num of transactions and num pages.
	Returns:
		(txn_count, page_count) if success
		(0, 0) if fail
*/
func GetAccountStats(address string, start, end int64) (int, int, error) {
	addressMatch := genAddressMatch(address)
	unwindTxns := genUnwindPipe()
	timeFilter := genTimeFilter(start, end)
	count := genCountPipe()

	pipe := mongo.Pipeline{addressMatch, unwindTxns, timeFilter, count}
	cursor, err := performAggregation(pipe)
	if err != nil {
		return 0, 0, err
	}

	cursor.Next(context.TODO())
	txn_count := struct {
		Count float64 `json:"txn_count" bson:"txn_count"`
	}{}
	cursor.Decode(&txn_count)

	num_pages := int(math.Ceil(txn_count.Count / PAGE_SIZE))

	return int(txn_count.Count), num_pages, nil
}

/*
	Get all transactions for specific account; sorted old to new
	Returns:
		([]Transaction, nil) if success
		(nil, error) if fail
*/
func GetAllTxns(address string) ([]Transaction, error) {
	addressMatch := genAddressMatch(address)
	unwindTxns := genUnwindPipe()
	group := genGroupPipe()
	pipe := mongo.Pipeline{addressMatch, unwindTxns, group}

	cursor, err := performAggregation(pipe)
	if err != nil {
		return nil, err
	}

	var txn TxnWrapper
	cursor.Next(context.TODO())
	cursor.Decode(&txn)

	return txn.Txns, nil
}

/*
	Get transactions between time start and end; sorted old to new.
	Returns:
		([]byte, nil) if success
		(nil, error) if fail
*/
func GetTxnsBetweenTimes(address string, start, end int64) ([]Transaction, error) {
	// Aggregation pipes
	addressMatch := genAddressMatch(address)
	unwindTxns := genUnwindPipe()
	timeFilter := genTimeFilter(start, end)
	group := genGroupPipe()
	pipe := mongo.Pipeline{addressMatch, unwindTxns, timeFilter, group}

	cursor, err := performAggregation(pipe)
	if err != nil {
		return nil, err
	}

	var txn TxnWrapper
	cursor.Next(context.TODO())
	cursor.Decode(&txn)

	return txn.Txns, nil
}

/*
	Appends to account with address
	Returns: nil if success, error if fail
*/
func UpsertTxns(address string, txns []Transaction) error {
	// Since upsert=true, if account doesn't exist,
	// it will be created with received txns
	update := genAppendTxnPipe(txns)
	res, err := performUpdate(address, update)

	log.Printf("Num transactions upserted: %v", res.ModifiedCount)

	return err
}

func performUpdate(address string, update bson.D) (*mongo.UpdateResult, error) {
	ops := options.Update().SetUpsert(true)
	addressMatch := bson.D{{Key: "address", Value: address}}
	res, err := client.txns.UpdateOne(context.TODO(), addressMatch, update, ops)
	if err != nil {
		return nil, err
	}
	return res, nil
}

// Generic aggregation function
func performAggregation(pipe mongo.Pipeline) (*mongo.Cursor, error) {
	cursor, err := client.txns.Aggregate(context.TODO(), pipe)
	if err != nil {
		return nil, err
	}
	return cursor, nil
}
