package handler

import (
	"github.com/MadMax168/CloudPocket.git/config"
	"github.com/MadMax168/CloudPocket.git/models"
	"github.com/gofiber/fiber/v2"
	"strconv"
)

func GetTrans(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.SendStatus(401)
	}

	WID_str := c.Params("walletID")
	WID, err := strconv.ParseUint(WID_str, 10, 32)
	if err != nil {
		return c.Status(400).SendString("Invalid wallet ID")
	}

	// Verify wallet belongs to user
	var wallet models.Wallet
	if err := config.DB.Where("user_id = ? AND id = ?", UID, WID).First(&wallet).Error; err != nil {
		return c.SendStatus(404) // Or 403 Forbidden
	}

	var txs []models.Transaction
	config.DB.Where("wallet_id = ?", WID).Find(&txs)

	return c.Status(200).JSON(&txs)
}

func AddTrans(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.SendStatus(401)
	}

	WID_str := c.Params("walletID")
	WID, err := strconv.ParseUint(WID_str, 10, 32)
	if err != nil {
		return c.Status(400).SendString("Invalid wallet ID")
	}

	// Verify wallet belongs to user
	var wallet models.Wallet
	if err := config.DB.Where("user_id = ? AND id = ?", UID, WID).First(&wallet).Error; err != nil {
		return c.SendStatus(404) // Or 403 Forbidden
	}

	tx := new(models.Transaction)
	if err := c.BodyParser(&tx); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	tx.UserID = UID
	tx.WalletID = uint(WID)
	tx.Status = true
	config.DB.Create(&tx)
	return c.Status(201).JSON(tx)
}

func UpdTrans(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.SendStatus(401)
	}

	WID_str := c.Params("walletID")
	WID, err := strconv.ParseUint(WID_str, 10, 32)
	if err != nil {
		return c.Status(400).SendString("Invalid wallet ID")
	}

	// Verify wallet belongs to user
	var wallet models.Wallet
	if err := config.DB.Where("user_id = ? AND id = ?", UID, WID).First(&wallet).Error; err != nil {
		return c.SendStatus(404) // Or 403 Forbidden
	}

	id := c.Params("id")
	tx := new(models.Transaction)
	if err := c.BodyParser(tx); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	config.DB.Where("user_id = ? AND wallet_id = ? AND id = ?", UID, WID, id).Updates(&tx)
	return c.Status(200).JSON(tx)
}

func DelTrans(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.SendStatus(401)
	}

	WID_str := c.Params("walletID")
	WID, err := strconv.ParseUint(WID_str, 10, 32)
	if err != nil {
		return c.Status(400).SendString("Invalid wallet ID")
	}

	// Verify wallet belongs to user
	var wallet models.Wallet
	if err := config.DB.Where("user_id = ? AND id = ?", UID, WID).First(&wallet).Error; err != nil {
		return c.SendStatus(404) // Or 403 Forbidden
	}

	id := c.Params("id")
	var tx models.Transaction

	result := config.DB.Where("user_id = ? AND wallet_id = ? AND id = ?", UID, WID, id).Delete(&tx)

	if result.RowsAffected == 0 {
		return c.SendStatus(404)
	}

	return c.SendStatus(200)
}