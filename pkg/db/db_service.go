// db/db_service.go
// Service Handles all communication with mongodb database

package db

import "go.mongodb.org/mongo-driver/mongo"

const ()

var client *mongo.Client // is this the best way to track mongo connection?

/*
	Creates MongoClient object.
	Returns:
		* (*mongo.Client, nil) if success
		* (nil, error) if fail
*/
func InitMongoClient() (*mongo.Client, error) {
	return nil, nil
}

/*
	Get all transactions for specific account
	sorted from oldest to newest
	Returns:
		* ([]Transaction, nil) if success
		* (nil, error) if fail
*/
func (acc *Account) GetAllTxns() ([]Transaction, error) {
	return nil, nil
}

/*
	Get transactions for specific account between Unix time start and end
	sorted from oldest to newest.
	Returns:
		* ([]Transaction, nil) if success
		* (nil, error) if fail
*/
func (acc *Account) GetTxnsBetweenTimes(start, end int64) ([]Transaction, error) {
	return nil, nil
}

/*
	Sorts received txns args and appends to specific account
	Returns: nil if success, error if fail
*/
func (acc *Account) AppendMultipleTxn(txns []Transaction) error {
	return nil
}

/*
	Append single transaction to specific account
	Returns: nil if success, error if fail
*/
func (acc *Account) AppendSingleTxn(txn Transaction) error {
	return nil
}

/*
	Create document for new account
	Returns: nil if success, error if fail
*/
func (acc *Account) InsertNewAccount() error {
	return nil
}
