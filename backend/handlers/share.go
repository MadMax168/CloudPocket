package handler

import (
	"github.com/MadMax168/CloudPocket.git/config"
	"github.com/MadMax168/CloudPocket.git/models"
	"github.com/gofiber/fiber/v2"
)

func ShareWallet(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.SendStatus(401)
	}

	walletID := c.Params("walletID")

	var wallet models.Wallet
	if err := config.DB.Where("user_id = ? AND id = ?", UID, walletID).First(&wallet).Error; err != nil {
		return c.SendStatus(404)
	}

	var input struct {
		Email      string `json:"email"`
		Permission string `json:"permission"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	var targetUser models.User
	if err := config.DB.Where("email = ?", input.Email).First(&targetUser).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"message": "User not found"})
	}

	var existingShare models.WalletShare
	if err := config.DB.Where("wallet_id = ? AND shared_with_id = ?", walletID, targetUser.ID).First(&existingShare).Error; err == nil {
		return c.Status(409).JSON(fiber.Map{"message": "Wallet already shared with this user"})
	}

	share := models.WalletShare{
		WalletID:     wallet.ID,
		OwnerID:      UID,
		SharedWithID: targetUser.ID,
		Permission:   input.Permission,
		Status:       "pending",
	}

	config.DB.Create(&share)
	return c.Status(201).JSON(share)
}

func GetSharedWallets(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.SendStatus(401)
	}

	var shares []models.WalletShare
	config.DB.Where("shared_with_id = ? AND status = ?", UID, "accepted").
		Preload("Wallet").
		Preload("Owner").
		Find(&shares)

	return c.Status(200).JSON(shares)
}

func GetPendingShares(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.SendStatus(401)
	}

	var shares []models.WalletShare
	config.DB.Where("shared_with_id = ? AND status = ?", UID, "pending").
		Preload("Wallet").
		Preload("Owner").
		Find(&shares)

	return c.Status(200).JSON(shares)
}

func RespondToShare(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.SendStatus(401)
	}

	shareID := c.Params("shareID")

	var input struct {
		Status string `json:"status"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	result := config.DB.Model(&models.WalletShare{}).
		Where("id = ? AND shared_with_id = ?", shareID, UID).
		Update("status", input.Status)

	if result.RowsAffected == 0 {
		return c.SendStatus(404)
	}

	return c.Status(200).JSON(fiber.Map{"message": "Share updated"})
}
