package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// AddressBook contains all addresses in database.
type AddressBook struct {
	Id        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Addresses []string           `json:"addresses" bson:"addresses"`
}

// Account represents a single wallet and its transactions.
type Account struct {
	Id      primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"` // don't know if we need this
	Address string             `json:"address" bson:"address"`
	Txns    []Transaction      `json:"transactions" bson:"transactions"`
}
