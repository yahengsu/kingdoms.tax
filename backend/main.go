package main

import (
	"log"
	"net/http"
	"os"
	"strconv"

	"dfk-txns-be/controllers"
	"dfk-txns-be/db"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	// Load .env file if local
	if os.Getenv("ENV") != "prod" {
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	// Set up DB pool
	dbUrl := os.Getenv("POSTGRES_URL")
	dbPort, err := strconv.Atoi(os.Getenv("POSTGRES_PORT"))
	if err != nil {
		log.Fatalf("POSTGRES_PORT is not a valid integer: %v", err)
	}
	dbName := os.Getenv("POSTGRES_DB")
	dbUser := os.Getenv("POSTGRES_USER")
	dbPassword := os.Getenv("POSTGRES_PASSWORD")

	database, err := db.Initialize(dbUrl, dbUser, dbPassword, dbName, dbPort)
	if err != nil {
		log.Fatalf("Error initializing DB: %v", err)
	}

	server := controllers.NewBaseController(database)
	c := cors.New(cors.Options{
		AllowedMethods:   []string{http.MethodGet, http.MethodPost, http.MethodDelete},
		AllowedOrigins:   []string{"*"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
		Debug:            true,
	})

	// Register routes
	r := mux.NewRouter()
	r.HandleFunc("/transactions", server.GetTransactions).Methods("GET")
	r.HandleFunc("/transactions", controllers.AuthenticateRoute(server.AddTransactions)).Methods("POST")

	// Run server
	port := os.Getenv("PORT")
	if port == "" {
		log.Println("PORT not set, defaulting to 8080")
		port = "8080"
	}
	log.Fatal(http.ListenAndServe(":"+port, c.Handler(r)))
}
