package main

import (
	"log"
	"net/http"

	"dfk-txns-be/routes"
	"github.com/gorilla/mux"
)

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/transactions", routes.GetTransactions).Methods("GET")

	log.Fatal(http.ListenAndServe(":8080", r))
}
