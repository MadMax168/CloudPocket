package models

import (
	"gorm.io/gorm"
)

type WalletShare struct {
	gorm.Model
	WalletID     uint   `json:"wallet_id"`
	OwnerID      uint   `json:"owner_id"`
	SharedWithID uint   `json:"shared_with_id"`
	Permission   string `json:"permission"`
	Status       string `json:"status"`

	Wallet     Wallet `gorm:"foreignKey:WalletID"`
	Owner      User   `gorm:"foreignKey:OwnerID"`
	SharedWith User   `gorm:"foreignKey:SharedWithID"`
}
