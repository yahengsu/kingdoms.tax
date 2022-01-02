package controllers

import (
	"dfk-txns-be/db"
)

type BaseController struct {
	db *db.Database
}

func NewBaseController(db *db.Database) *BaseController {
	return &BaseController{db: db}
}
