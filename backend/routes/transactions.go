package routes

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"dfk-txns-be/models"
)

// GetTransactionsResponse represents a paginated response to a query for some subset of a user's transactions.
type GetTransactionsResponse struct {
	Transactions []models.Transaction `json:"transactions"`
	Total        int                  `json:"total"`
	HasMore      bool                 `json:"has_more"`
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
	json.NewEncoder(w).Encode(GetTransactionsResponse{})
}
