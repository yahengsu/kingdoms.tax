package db

import (
	"context"
	"fmt"
	"strings"

	"dfk-txns-be/models"
)

const BasePriceQuery = `
SELECT
	account, counterparty, block_num, direction, net_amount, timestamp, token_address, token_id, token_type, txn_hash, log_index, COALESCE(usd, 0.0) as usd
FROM
	(
		SELECT
			account, counterparty, block_num, direction, net_amount, res.timestamp, token_address, token_id, token_type, txn_hash, log_index, price as usd,
			ROW_NUMBER() OVER 
				(PARTITION BY account, counterparty, block_num, direction, net_amount, res.timestamp, token_address, token_id, token_type, txn_hash, log_index 
					ORDER BY ABS(res.timestamp - Price.timestamp)) AS rank
		FROM
		(%s) as res
		LEFT JOIN Price
		ON res.token_address = Price.token
	) AS diffs
WHERE rank = 1
ORDER BY timestamp DESC;
`

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
	innerQuery := `SELECT * FROM Transaction WHERE account = $1 ORDER BY timestamp DESC LIMIT $2 OFFSET $3`
	query := fmt.Sprintf(BasePriceQuery, innerQuery)

	rows, err := db.pool.Query(context.TODO(), query, strings.ToLower(account), count, offset)
	if err != nil {
		return txns, fmt.Errorf("failed to get transactions: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var txn models.Transaction
		err := rows.Scan(&txn.Account, &txn.CounterParty, &txn.BlockNum, &txn.Direction, &txn.NetAmount,
			&txn.Timestamp, &txn.TokenAddr, &txn.TokenID, &txn.TokenType, &txn.TxnHash, &txn.LogIndex, &txn.Price)

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
	innerQuery := `SELECT * FROM Transaction WHERE account = $1 AND timestamp BETWEEN $2 AND $3 ORDER BY timestamp DESC LIMIT $4 OFFSET $5`
	query := fmt.Sprintf(BasePriceQuery, innerQuery)

	rows, err := db.pool.Query(context.TODO(), query, strings.ToLower(account), startTime, endTime, count, offset)
	if err != nil {
		return txns, fmt.Errorf("failed to get transactions: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var txn models.Transaction
		err := rows.Scan(&txn.Account, &txn.CounterParty, &txn.BlockNum, &txn.Direction, &txn.NetAmount,
			&txn.Timestamp, &txn.TokenAddr, &txn.TokenID, &txn.TokenType, &txn.TxnHash, &txn.LogIndex, &txn.Price)

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
	innerQuery := `SELECT * FROM Transaction WHERE account = $1 AND timestamp <= $2 ORDER BY timestamp DESC LIMIT $3 OFFSET $4`
	query := fmt.Sprintf(BasePriceQuery, innerQuery)

	rows, err := db.pool.Query(context.TODO(), query, strings.ToLower(account), endTime, count, offset)
	if err != nil {
		return txns, fmt.Errorf("failed to get transactions: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var txn models.Transaction
		err := rows.Scan(&txn.Account, &txn.CounterParty, &txn.BlockNum, &txn.Direction, &txn.NetAmount,
			&txn.Timestamp, &txn.TokenAddr, &txn.TokenID, &txn.TokenType, &txn.TxnHash, &txn.LogIndex, &txn.Price)

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
	innerQuery := `SELECT * FROM Transaction WHERE account = $1 AND timestamp >= $2 ORDER BY timestamp DESC LIMIT $3 OFFSET $4`
	query := fmt.Sprintf(BasePriceQuery, innerQuery)

	rows, err := db.pool.Query(context.TODO(), query, strings.ToLower(account), startTime, count, offset)
	if err != nil {
		return txns, fmt.Errorf("failed to get transactions: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var txn models.Transaction
		err := rows.Scan(&txn.Account, &txn.CounterParty, &txn.BlockNum, &txn.Direction, &txn.NetAmount,
			&txn.Timestamp, &txn.TokenAddr, &txn.TokenID, &txn.TokenType, &txn.TxnHash, &txn.LogIndex, &txn.Price)

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

func (db *Database) GetQuestRewards(account string) ([]models.QuestReward, error) {
	var questCounts []models.QuestReward

	query := `
		SELECT token_address, COUNT(*) as c
		FROM Transaction
		WHERE account = $1 AND counterparty = '0x0000000000000000000000000000000000000000' AND direction = 'IN'
		GROUP BY token_address
		ORDER BY c DESC;
	`

	rows, err := db.pool.Query(context.TODO(), query, strings.ToLower(account))
	if err != nil {
		return questCounts, fmt.Errorf("failed to get questCounts: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var quest models.QuestReward
		err := rows.Scan(&quest.TokenAddr, &quest.Count)

		if err != nil {
			return questCounts, fmt.Errorf("failed to scan questCounts: %v", err)
		}

		questCounts = append(questCounts, quest)
	}

	if rows.Err() != nil {
		return questCounts, fmt.Errorf("failed to get questCounts: %v", err)
	}

	return questCounts, nil
}

func (db *Database) GetQuestRewardsInRange(account string, startTime, endTime int) ([]models.QuestReward, error) {
	var questCounts []models.QuestReward

	query := `
		SELECT token_address, COUNT(*) as c
		FROM Transaction
		WHERE account = $1 AND counterparty = '0x0000000000000000000000000000000000000000' AND direction = 'IN' AND timestamp BETWEEN $2 AND $3
		GROUP BY token_address
		ORDER BY c DESC;
	`

	rows, err := db.pool.Query(context.TODO(), query, strings.ToLower(account), startTime, endTime)
	if err != nil {
		return questCounts, fmt.Errorf("failed to get questCounts: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var quest models.QuestReward
		err := rows.Scan(&quest.TokenAddr, &quest.Count)

		if err != nil {
			return questCounts, fmt.Errorf("failed to scan questCounts: %v", err)
		}

		questCounts = append(questCounts, quest)
	}

	if rows.Err() != nil {
		return questCounts, fmt.Errorf("failed to get questCounts: %v", err)
	}

	return questCounts, nil
}

func (db *Database) GetQuestRewardsUpTo(account string, endTime int) ([]models.QuestReward, error) {
	var questCounts []models.QuestReward

	query := `
		SELECT token_address, COUNT(*) as c
		FROM Transaction
		WHERE account = $1 AND counterparty = '0x0000000000000000000000000000000000000000' AND direction = 'IN' AND timestamp <= $2
		GROUP BY token_address
		ORDER BY c DESC;
	`

	rows, err := db.pool.Query(context.TODO(), query, strings.ToLower(account), endTime)
	if err != nil {
		return questCounts, fmt.Errorf("failed to get questCounts: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var quest models.QuestReward
		err := rows.Scan(&quest.TokenAddr, &quest.Count)

		if err != nil {
			return questCounts, fmt.Errorf("failed to scan questCounts: %v", err)
		}

		questCounts = append(questCounts, quest)
	}

	if rows.Err() != nil {
		return questCounts, fmt.Errorf("failed to get questCounts: %v", err)
	}

	return questCounts, nil
}

func (db *Database) GetQuestRewardsStartingFrom(account string, startTime int) ([]models.QuestReward, error) {
	var questCounts []models.QuestReward

	query := `
		SELECT token_address, COUNT(*) as C
		FROM Transaction
		WHERE account = $1 AND counterparty = '0x0000000000000000000000000000000000000000' AND direction = 'IN' AND timestamp >= $2
		GROUP BY token_address
		ORDER BY c DESC;
	`

	rows, err := db.pool.Query(context.TODO(), query, strings.ToLower(account), startTime)
	if err != nil {
		return questCounts, fmt.Errorf("failed to get questCounts: %v", err)
	}
	defer rows.Close()

	for rows.Next() {
		var quest models.QuestReward
		err := rows.Scan(&quest.TokenAddr, &quest.Count)

		if err != nil {
			return questCounts, fmt.Errorf("failed to scan questCounts: %v", err)
		}

		questCounts = append(questCounts, quest)
	}

	if rows.Err() != nil {
		return questCounts, fmt.Errorf("failed to get questCounts: %v", err)
	}

	return questCounts, nil
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
