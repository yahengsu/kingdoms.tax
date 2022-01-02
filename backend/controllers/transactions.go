package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"dfk-txns-be/models"
)

// GetTransactionsResponse represents a paginated response to a query for some subset of a user's transactions.
type GetTransactionsResponse struct {
	Transactions []models.Transaction `json:"transactions"`
	Total        int                  `json:"total"`
	HasMore      bool                 `json:"has_more"`
}

func (b *BaseController) GetTransactions(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	startTime := query.Get("startTime")
	endTime := query.Get("endTime")
	address := query.Get("address")

	page, err := strconv.Atoi(query.Get("page"))
	if err != nil || page < 0 {
		log.Println("invalid page in request, defaulting to 0")
		page = 0
	}

	count, err := strconv.Atoi(query.Get("count"))
	if err != nil || count <= 0 {
		log.Println("invalid count in request, defaulting to 25")
		count = 25
	}

	response := GetTransactionsResponse{}

	selectAll := startTime == "" && endTime == ""
	offset := page * count

	var txns []models.Transaction
	if selectAll {
		response.Total, err = b.db.GetNumTransactions(address)
		if err != nil {
			log.Printf("error getting total transaction count: %v", err)
			http.Error(w, "error getting transactions", http.StatusInternalServerError)
			return
		}
		response.HasMore = response.Total > offset+count

		txns, err = b.db.GetTransactions(address, offset, count)
		if err != nil {
			log.Printf("error getting transactions: %v", err)
			http.Error(w, "error getting transactions", http.StatusInternalServerError)
			return
		}
	} else {
		log.Println("selecting transactions by time range")
		startTimeInt, err := strconv.Atoi(startTime)
		if err != nil {
			log.Printf("error parsing start time: %v", err)
			http.Error(w, "invalid startTime in request", http.StatusBadRequest)
			return
		}

		endTimeInt, err := strconv.Atoi(endTime)
		if err != nil {
			log.Printf("error parsing end time: %v", err)
			http.Error(w, "invalid endTime in request", http.StatusBadRequest)
			return
		}

		response.Total, err = b.db.GetNumTransactionsInRange(address, startTimeInt, endTimeInt)
		if err != nil {
			log.Printf("error getting total transaction count: %v", err)
			http.Error(w, "error getting transactions", http.StatusInternalServerError)
			return
		}
		response.HasMore = response.Total > offset+count

		txns, err = b.db.GetTransactionsInRange(address, startTimeInt, endTimeInt, offset, count)
		if err != nil {
			log.Printf("error getting transactions: %v", err)
			http.Error(w, "error getting transactions", http.StatusInternalServerError)
			return
		}
	}

	response.Transactions = txns
	err = json.NewEncoder(w).Encode(response)
	if err != nil {
		log.Printf("error encoding response: %v", err)
		http.Error(w, "error encoding response", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
}
