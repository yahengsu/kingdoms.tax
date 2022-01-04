package db

import (
	"context"
	"fmt"
	"strings"

	"dfk-txns-be/models"
)

// GetNumTransactions returns the total number of transactions
// made by the given account or an error if encountered.
func (db *Database) GetNumTransactions(account string) (int, error) {
	var count int
	query := `SELECT COUNT(*) FROM Transaction WHERE account = $1;`

	err := db.pool.QueryRow(context.TODO(), query, strings.ToLower(account)).Scan(&count)
	if err != nil {
		return count, fmt.Errorf("failed to get number of transactions: %v", err)
	}

	return count, nil
}

// GetNumTransactionsInRange returns the total number of transactions
// made by the given account in the given timeframe or an error if encountered.
func (db *Database) GetNumTransactionsInRange(account string, startTime, endTime int) (int, error) {
	var count int
	query := `SELECT COUNT(*) FROM Transaction WHERE account = $1 AND timestamp BETWEEN $2 AND $3;`

	err := db.pool.QueryRow(context.TODO(), query, strings.ToLower(account), startTime, endTime).Scan(&count)
	if err != nil {
		return count, fmt.Errorf("failed to get number of transactions: %v", err)
	}

	return count, nil
}

// GetNumTransactionsUpTo returns the total number of transactions
// made by the given account up to the given timestamp or an error if encountered.
func (db *Database) GetNumTransactionsUpTo(account string, endTime int) (int, error) {
	var count int
	query := `SELECT COUNT(*) FROM Transaction WHERE account = $1 AND timestamp <= $2;`

	err := db.pool.QueryRow(context.TODO(), query, strings.ToLower(account), endTime).Scan(&count)
	if err != nil {
		return count, fmt.Errorf("failed to get number of transactions: %v", err)
	}

	return count, nil
}

// GetNumTransactionsStartingFrom returns the total number of transactions
// made by the given account starting from the given timestamp or an error if encountered.
func (db *Database) GetNumTransactionsStartingFrom(account string, startTime int) (int, error) {
	var count int
	query := `SELECT COUNT(*) FROM Transaction WHERE account = $1 AND timestamp >= $2;`

	err := db.pool.QueryRow(context.TODO(), query, strings.ToLower(account), startTime).Scan(&count)
	if err != nil {
		return count, fmt.Errorf("failed to get number of transactions: %v", err)
	}

	return count, nil
}

// GetTransactions returns transactions made by the given account
// paginated by the given offset and limit, or an error if encountered.
func (db *Database) GetTransactions(account string, offset, count int) ([]models.Transaction, error) {
	var txns []models.Transaction
	query := `SELECT * FROM Transaction WHERE account = $1 ORDER BY timestamp DESC LIMIT $2 OFFSET $3;`

	rows, err := db.pool.Query(context.TODO(), query, strings.ToLower(account), count, offset)
	if err != nil {
		return txns, fmt.Errorf("failed to get transactions: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var txn models.Transaction
		err := rows.Scan(&txn.Account, &txn.CounterParty, &txn.BlockNum, &txn.Direction, &txn.NetAmount,
			&txn.Timestamp, &txn.TokenAddr, &txn.TokenID, &txn.TokenType, &txn.TxnHash, &txn.LogIndex)

		if err != nil {
			return txns, fmt.Errorf("failed to scan transaction: %v", err)
		}

		txns = append(txns, txn)
	}

	if rows.Err() != nil {
		return txns, fmt.Errorf("failed to get transactions: %v", err)
	}

	return txns, nil
}

// GetTransactionsInRange returns transactions made by the given account
// in the specified time period, paginated by the given offset and limit, or an error if encountered.
func (db *Database) GetTransactionsInRange(account string, startTime, endTime, offset, count int) ([]models.Transaction, error) {
	var txns []models.Transaction
	query := `SELECT * FROM Transaction WHERE account = $1 AND timestamp BETWEEN $2 AND $3 ORDER BY timestamp DESC LIMIT $4 OFFSET $5;`

	rows, err := db.pool.Query(context.TODO(), query, strings.ToLower(account), startTime, endTime, count, offset)
	if err != nil {
		return txns, fmt.Errorf("failed to get transactions: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var txn models.Transaction
		err := rows.Scan(&txn.Account, &txn.CounterParty, &txn.BlockNum, &txn.Direction, &txn.NetAmount,
			&txn.Timestamp, &txn.TokenAddr, &txn.TokenID, &txn.TokenType, &txn.TxnHash, &txn.LogIndex)

		if err != nil {
			return txns, fmt.Errorf("failed to scan transaction: %v", err)
		}

		txns = append(txns, txn)
	}

	if rows.Err() != nil {
		return txns, fmt.Errorf("failed to get transactions: %v", err)
	}

	return txns, nil
}

// GetTransactionsUpTo returns transactions made by the given account
// up to the given time stamp, paginaged by the given offset and limit, or an error if encountered.
func (db *Database) GetTransactionsUpTo(account string, endTime, offset, count int) ([]models.Transaction, error) {
	var txns []models.Transaction
	query := `SELECT * FROM Transaction WHERE account = $1 AND timestamp <= $2 ORDER BY timestamp DESC LIMIT $3 OFFSET $4;`

	rows, err := db.pool.Query(context.TODO(), query, strings.ToLower(account), endTime, count, offset)
	if err != nil {
		return txns, fmt.Errorf("failed to get transactions: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var txn models.Transaction
		err := rows.Scan(&txn.Account, &txn.CounterParty, &txn.BlockNum, &txn.Direction, &txn.NetAmount,
			&txn.Timestamp, &txn.TokenAddr, &txn.TokenID, &txn.TokenType, &txn.TxnHash, &txn.LogIndex)

		if err != nil {
			return txns, fmt.Errorf("failed to scan transaction: %v", err)
		}

		txns = append(txns, txn)
	}

	if rows.Err() != nil {
		return txns, fmt.Errorf("failed to get transactions: %v", err)
	}

	return txns, nil
}

// GetTransactionsStartingFrom returns transactions made by the given account
// starting from the given time stamp, paginaged by the given offset and limit, or an error if encountered.
func (db *Database) GetTransactionsStartingFrom(account string, startTime, offset, count int) ([]models.Transaction, error) {
	var txns []models.Transaction
	query := `SELECT * FROM Transaction WHERE account = $1 AND timestamp >= $2 ORDER BY timestamp DESC LIMIT $3 OFFSET $4;`

	rows, err := db.pool.Query(context.TODO(), query, strings.ToLower(account), startTime, count, offset)
	if err != nil {
		return txns, fmt.Errorf("failed to get transactions: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var txn models.Transaction
		err := rows.Scan(&txn.Account, &txn.CounterParty, &txn.BlockNum, &txn.Direction, &txn.NetAmount,
			&txn.Timestamp, &txn.TokenAddr, &txn.TokenID, &txn.TokenType, &txn.TxnHash, &txn.LogIndex)

		if err != nil {
			return txns, fmt.Errorf("failed to scan transaction: %v", err)
		}

		txns = append(txns, txn)
	}

	if rows.Err() != nil {
		return txns, fmt.Errorf("failed to get transactions: %v", err)
	}

	return txns, nil
}

// AddTransaction adds a transaction to the database.
func (db *Database) AddTransaction(txn models.Transaction) error {
	query := `INSERT INTO Transaction (account, counterparty, block_num, direction, net_amount, timestamp, token_address, token_id, token_type, txn_hash, log_index) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`

	_, err := db.pool.Exec(context.TODO(), query, strings.ToLower(txn.Account), txn.CounterParty, txn.BlockNum, txn.Direction, txn.NetAmount,
		txn.Timestamp, txn.TokenAddr, txn.TokenID, txn.TokenType, txn.TxnHash, txn.LogIndex)
	if err != nil {
		return fmt.Errorf("failed to add transaction: %v", err)
	}

	return nil
}
