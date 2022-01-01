package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"dfk-txns-be/db"
	"dfk-txns-be/models"
	"golang.org/x/sync/errgroup"
)

type IndexerOutput map[string][]models.Transaction

func (b *BaseController) AddTransactions(w http.ResponseWriter, r *http.Request) {
	indexedTxns := IndexerOutput{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&indexedTxns); err != nil {
		http.Error(w, fmt.Sprintf("failed to unmarshall json input: %v", err), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Process each address in a separate goroutine
	insertGroup, _ := errgroup.WithContext(r.Context())
	txnCount := 0
	for address, txns := range indexedTxns {
		txnCount += len(txns)
		insertGroup.Go(func() error {
			return db.UpsertTransactions(address, txns)
		})
	}

	// Return on first error
	if err := insertGroup.Wait(); err != nil {
		http.Error(w, fmt.Sprintf("failed to upsert transactions: %v", err), http.StatusInternalServerError)
		return
	}

	log.Printf("Added %d transactions", txnCount)
	w.WriteHeader(http.StatusOK)
	return
}
