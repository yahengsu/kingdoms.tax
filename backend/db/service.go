// db/service.go
// Service Handles all communication with mongodb database

package db

import (
	"context"
	"os"

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
	newConn, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri).SetAuth(options.Credential{
		Username: os.Getenv("MONGODB_USER"),
		Password: os.Getenv("MONGODB_PASSWORD"),
	}))
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

// GetTotalTransactionCount returns the total number of transactions
// a given account has made or an error if encountered.
func GetTotalTransactionCount(address string) (int, error) {
	pipe := mongo.Pipeline{
		addressMatch(address),
		unwindTxns(),
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

// GetTransactionCountInRange returns the number of transactions a
// given account made between the given start and end timestamps
// or an error if encountered.
func GetTransactionCountInRange(address string, start, end int64) (int, error) {
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

// GetAllTransactions returns a list of transactions for the given address
// starting at the given page and pageSize or an error if encountered.
func GetAllTransactions(address string, page, pageSize int) ([]models.Transaction, error) {
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

	txnPage := struct {
		Transactions []models.Transaction `json:"txns" bson:"txns"`
	}{}
	cursor, err := performAggregation(pipe)
	if err != nil {
		return []models.Transaction{}, err
	}

	cursor.Next(context.TODO())
	err = cursor.Decode(&txnPage)
	if err != nil {
		return []models.Transaction{}, err
	}

	return txnPage.Transactions, nil
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

	txnPage := struct {
		Transactions []models.Transaction `json:"txns" bson:"txns"`
	}{}
	cursor, err := performAggregation(pipe)
	if err != nil {
		return []models.Transaction{}, err
	}

	cursor.Next(context.TODO())
	err = cursor.Decode(&txnPage)
	if err != nil {
		return []models.Transaction{}, err
	}

	return txnPage.Transactions, nil
}

// UpsertTransactions appends the provided transactions to the record
// for the given account or creates the record if it does not exist.
func UpsertTransactions(address string, txns []models.Transaction) error {
	// Since upsert=true, if account doesn't exist,
	// it will be created with received txns
	update := appendTxns(txns)
	_, err := performUpdate(address, update)
	return err
}

func performUpdate(address string, update bson.D) (*mongo.UpdateResult, error) {
	ops := options.Update().SetUpsert(true)
	addressMatch := bson.M{"address": address}
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
