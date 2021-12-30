package routes

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"dfk-txns-be/models"
)

// TransactionResponse represents a paginated response to a query for some subset of a user's transactions.
type TransactionResponse struct {
	Transactions []models.Transaction `json:"transactions"`
	CurrentPage  int                  `json:"currentPage"`
	TotalPages   int                  `json:"totalPages"`
}

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
