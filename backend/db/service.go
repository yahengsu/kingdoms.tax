// db/service.go
// Service Handles all communication with mongodb database

package db

import (
	"context"
	"log"

	"dfk-txns-be/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DBConnection struct {
	init     bool
	conn     *mongo.Client
	txns     *mongo.Collection
	accounts *mongo.Collection
}

var client DBConnection

// InitMongoClient initializes the global Mongo client and
// returns an error if encountered.
func InitMongoClient(uri string) error {
	newConn, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		return err
	}
	// Set client struct
	client = DBConnection{
		init:     true,
		conn:     newConn,
		txns:     newConn.Database("dfk-txns").Collection("txns"),
		accounts: newConn.Database("dfk-txns").Collection("accounts"),
	}
	return nil
}

// GetTransactionCount returns the number of transactions a
// given account made between the given start and end timestamps
// or an error if encountered.
func GetTransactionCount(address string, start, end int64) (int, error) {
	pipe := mongo.Pipeline{
		addressMatch(address),
		unwindTxns(),
		filterTimestamps(start, end),
		countTxns(),
	}
	cursor, err := performAggregation(pipe)
	if err != nil {
		return 0, err
	}

	cursor.Next(context.TODO())
	txnCount := struct {
		Count float64 `json:"txn_count" bson:"txn_count"`
	}{}
	err = cursor.Decode(&txnCount)
	if err != nil {
		return 0, err
	}

	return int(txnCount.Count), nil
}

// GetTransactions returns a list of transactions for the given address
// starting at the given page and pageSize or an error if encountered.
func GetTransactions(address string, page, pageSize int) ([]models.Transaction, error) {
	// Transaction paging
	skipOffset := page * pageSize

	// Create aggregation pipeline
	pipe := mongo.Pipeline{
		addressMatch(address),
		unwindTxns(),
		sortByTimestamp(),
		skipTxns(skipOffset),
		limitTxns(pageSize),
		groupTxns(),
	}

	var txnPage []models.Transaction
	cursor, err := performAggregation(pipe)
	if err != nil {
		return txnPage, err
	}

	cursor.Next(context.TODO())
	err = cursor.Decode(&txnPage)
	if err != nil {
		return txnPage, err
	}

	return txnPage, nil
}

// GetTransactionsInTimeRange returns a list of transactions for the given
// address between the given start and end timestamps or an error if encountered.
// The transactions are paginated based on page and pageSize.
func GetTransactionsInTimeRange(address string, start, end int64, page, pageSize int) ([]models.Transaction, error) {
	// Transaction paging
	skipOffset := page * pageSize

	pipe := mongo.Pipeline{
		addressMatch(address),
		unwindTxns(),
		filterTimestamps(start, end),
		sortByTimestamp(),
		skipTxns(skipOffset),
		limitTxns(pageSize),
		groupTxns(),
	}

	var txnPage []models.Transaction
	cursor, err := performAggregation(pipe)
	if err != nil {
		return txnPage, err
	}

	cursor.Next(context.TODO())
	err = cursor.Decode(&txnPage)
	if err != nil {
		return txnPage, err
	}

	return txnPage, nil
}

// UpsertTransactions appends the provided transactions to the record
// for the given account or creates the record if it does not exist.
func UpsertTransactions(address string, txns []models.Transaction) error {
	// Since upsert=true, if account doesn't exist,
	// it will be created with received txns
	update := appendTxns(txns)
	res, err := performUpdate(address, update)

	log.Printf("Num transactions upserted: %v", res.ModifiedCount)

	return err
}

func performUpdate(address string, update bson.D) (*mongo.UpdateResult, error) {
	ops := options.Update().SetUpsert(true)
	//addressMatch := bson.D{{Key: "address", Value: address}}
	addressMatch := addressMatch(address)
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
