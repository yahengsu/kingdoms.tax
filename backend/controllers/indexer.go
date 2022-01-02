package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

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
		accountTxns := txns
		txnCount += len(txns)
		insertGroup.Go(func() error {
			for _, txn := range accountTxns {
				if err := b.db.AddTransaction(txn); err != nil {
					// Don't return an error for duplicate transactions, log and continue
					if strings.Contains(err.Error(), "duplicate key value violates unique constraint") {
						log.Printf("tried to insert duplicate transaction: %+v", txn)
						continue
					}
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
