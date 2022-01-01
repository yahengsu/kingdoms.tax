package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"dfk-txns-be/models"
	"golang.org/x/sync/errgroup"
)

type IndexerOutput map[string][]models.Transaction

func (b *BaseController) AddTransactions(w http.ResponseWriter, r *http.Request) {
	indexedTxns := IndexerOutput{}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&indexedTxns); err != nil {
		log.Printf("failed to unmarshal json input: %v", err)
		http.Error(w, fmt.Sprintf("failed to unmarshal json input: %v", err), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	// Process each address in a separate goroutine
	insertGroup, _ := errgroup.WithContext(context.TODO())
	txnCount := 0
	for _, txns := range indexedTxns {
		txnCount += len(txns)
		insertGroup.Go(func() error {
			for _, txn := range txns {
				if err := b.db.AddTransaction(txn); err != nil {
					return err
				}
			}
			return nil
		})
	}

	// Return on first error
	if err := insertGroup.Wait(); err != nil {
		log.Printf("failed to insert transactions: %v", err)
		http.Error(w, fmt.Sprintf("failed to insert transactions: %v", err), http.StatusInternalServerError)
		return
	}

	log.Printf("Added %d transactions", txnCount)
	w.WriteHeader(http.StatusOK)
	return
}
