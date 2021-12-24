package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

// Transaction - Transaction object from Harmony blockchain
type Transaction struct {
	BlockHash        string `json:"blockHash"`
	BlockNumber      uint64 `json:"blockNumber"`
	EthHash          string `json:"ethHash"`
	From             string `json:"from"`
	Gas              uint64 `json:"gas"`
	GasPrice         uint64 `json:"gasPrice"`
	Hash             string `json:"hash"`
	Input            string `json:"input"`
	Nonce            uint64 `json:"nonce"`
	R                string `json:"r"`
	S                string `json:"s"`
	ShardID          uint   `json:"shardID`
	Timestamp        uint64 `json:"timestamp"`
	To               string `json:"to"`
	ToShardID        uint   `json:"toShardID"`
	TransactionIndex uint   `json:"transactionIndex"`
	V                string `json:"v"`
	Value            uint64 `json:"value"`
}

// TransactionResponse - Response object
type TransactionResponse struct {
	Transactions []Transaction `json:"transactions"`
	CurrentPage  int           `json:"currentPage"`
	TotalPages   int           `json:"totalPages"`
}

// GetTransactions - Handles /transactions route
func GetTransactions(w http.ResponseWriter, r *http.Request) {
	log.Println("Endpoint Hit: GetTransactions")
	query := r.URL.Query()
	startTime := query.Get("startTime")
	endTime := query.Get("endTime")
	address := query.Get("address")
	selectAll := startTime == "" && endTime == ""
	fmt.Println(address, startTime, endTime)
	if selectAll {
		fmt.Println("Get all txns")
	} else {
		fmt.Println("Get txns within date")
	}
	json.NewEncoder(w).Encode(TransactionResponse{})
}

// StartServer - Start server and handles routes
func StartServer() {
	http.HandleFunc("/transactions", GetTransactions)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
