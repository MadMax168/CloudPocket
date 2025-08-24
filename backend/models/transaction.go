package models

import "gorm.io/gorm"

type Transaction struct {
	gorm.Model
	Title    string  `json:"title"`
	Type     string  `json:"type"`
	Amount   float64 `json:"amount"`
	Date     string  `json:"date"`
	Category string  `json:"category"`
	Desc     string  `json:"desc"`
	Status   bool    `json:"status"`
	WalletID uint
	Wallet   Wallet
	UserID   uint
	User     User
}
