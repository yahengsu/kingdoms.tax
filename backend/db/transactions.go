package db

import (
	"context"
	"fmt"

	"dfk-txns-be/models"
)

// GetNumTransactions returns the total number of transactions
// made by the given account or an error if encountered.
func (db *Database) GetNumTransactions(account string) (int, error) {
	var count int
	query := `SELECT COUNT(*) FROM Transactions WHERE account = $1;`

	err := db.pool.QueryRow(context.TODO(), query, account).Scan(&count)
	if err != nil {
		return count, fmt.Errorf("failed to get number of transactions: %v", err)
	}

	return count, nil
}

// GetNumTransactionsInRange returns the total number of transactions
// made by the given account in the given timeframe or an error if encountered.
func (db *Database) GetNumTransactionsInRange(account string, startTime, endTime int) (int, error) {
	var count int
	query := `SELECT COUNT(*) FROM Transactions WHERE account = $1 AND timestamp BETWEEN $2 AND $3;`

	err := db.pool.QueryRow(context.TODO(), query, account, startTime, endTime).Scan(&count)
	if err != nil {
		return count, fmt.Errorf("failed to get number of transactions: %v", err)
	}

	return count, nil
}

// GetTransactions returns transactions made by the given account
// paginated by the given offset and limit, or an error if encountered.
func (db *Database) GetTransactions(account string, offset, count int) ([]models.Transaction, error) {
	var txns []models.Transaction
	query := `SELECT * FROM Transactions WHERE account = $1 ORDER BY timestamp, txn_hash DESC LIMIT $2 OFFSET $3;`

	rows, err := db.pool.Query(context.TODO(), query, account, count, offset)
	if err != nil {
		return txns, fmt.Errorf("failed to get transactions: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var txn models.Transaction
		err := rows.Scan(&txn.Account, &txn.CounterParty, &txn.BlockNum, &txn.Direction, &txn.NetAmount,
			&txn.Timestamp, &txn.TokenAddr, &txn.TokenID, &txn.TokenType, &txn.TxnHash)

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
	query := `SELECT * FROM Transactions WHERE account = $1 AND timestamp BETWEEN $2 AND $3 ORDER BY timestamp DESC, txn_hash LIMIT $4 OFFSET $5;`

	rows, err := db.pool.Query(context.TODO(), query, account, startTime, endTime, count, offset)
	if err != nil {
		return txns, fmt.Errorf("failed to get transactions: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var txn models.Transaction
		err := rows.Scan(&txn.Account, &txn.CounterParty, &txn.BlockNum, &txn.Direction, &txn.NetAmount,
			&txn.Timestamp, &txn.TokenAddr, &txn.TokenID, &txn.TokenType, &txn.TxnHash)

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
	query := `INSERT INTO Transactions (account, counterparty, block_num, direction, net_amount, timestamp, token_address, token_id, token_type, txn_hash) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`

	_, err := db.pool.Exec(context.TODO(), query, txn.Account, txn.CounterParty, txn.BlockNum, txn.Direction, txn.NetAmount,
		txn.Timestamp, txn.TokenAddr, txn.TokenID, txn.TokenType, txn.TxnHash)
	if err != nil {
		return fmt.Errorf("failed to add transaction: %v", err)
	}

	return nil
}
