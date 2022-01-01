package db

import (
	"context"
	"fmt"
	"strconv"

	"github.com/jackc/pgx/v4/pgxpool"
)

type Database struct {
	pool *pgxpool.Pool
}

func Initialize(url, user, password, dbName string, port int) (*Database, error) {
	connectionString := "postgresql://" + user + ":" + password + "@" + url + ":" + strconv.Itoa(port) + "/" + dbName + "?sslmode=disable"
	config, err := pgxpool.ParseConfig(connectionString)
	if err != nil {
		return nil, fmt.Errorf("could not parse connection string: %v", err)
	}
	config.MaxConns = 90
	pool, err := pgxpool.ConnectConfig(context.TODO(), config)
	return &Database{pool: pool}, err
}
