package models

// Transaction is the database representation of a single DFK transaction.
type QuestReward struct {
	TokenAddr string `json:"token_addr"`
	Count     int    `json:"count"`
}
