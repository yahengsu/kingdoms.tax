package main

import (
	"log"
	"net/http"
	"os"

	"dfk-txns-be/db"
	"dfk-txns-be/routes"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file if local
	if os.Getenv("ENV") != "prod" {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	// Set up MongoDB
	err := db.InitMongoClient(os.Getenv("MONGODB_URL"))
	if err != nil {
		log.Fatalf("Error initializing MongoDB: %v", err)
	}

	// Set up router
	r := mux.NewRouter()
	r.HandleFunc("/transactions", routes.GetTransactions).Methods("GET")
	r.HandleFunc("/transactions", AuthenticateRoute(routes.AddTransactions)).Methods("POST")

	// Run server
	port := os.Getenv("PORT")
	if port == "" {
		log.Println("PORT not set, defaulting to 8080")
		port = "8080"
	}
	log.Fatal(http.ListenAndServe(":"+port, r))
}
