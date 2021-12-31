package routes

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"dfk-txns-be/db"
	"dfk-txns-be/models"
)

type IndexerOutput map[string][]models.Transaction

func AddTransactions(w http.ResponseWriter, r *http.Request) {
	indexedTxns := IndexerOutput{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&indexedTxns); err != nil {
		http.Error(w, fmt.Sprintf("failed to unmarshall json input: %v", err), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	for address, txns := range indexedTxns {
		log.Printf("address %s: %v", address, txns)
		if err := db.UpsertTransactions(address, txns); err != nil {
			http.Error(w, fmt.Sprintf("failed to upsert transactions: %v", err), http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	return
}
