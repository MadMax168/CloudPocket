package handler

import (
	"github.com/MadMax168/CloudPocket.git/config"
	"github.com/MadMax168/CloudPocket.git/models"
	"github.com/gofiber/fiber/v2"
)

type WalletRes struct {
	Index  uint    `json:"index"`
	Name   string  `json:"name"`
	Target string  `json:"target"`
	Goal   float64 `json:"goal"`
	Code   string  `json:"code"`
}

func GetWallet(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.SendStatus(401)
	}
	var wxs []models.Wallet

	if err := config.DB.Where("user_id = ?", UID).Find(&wxs).Error; err != nil {
		return c.SendStatus(500)
	}

	var response []WalletRes
	for _, i := range wxs {
		response = append(response, WalletRes{
			Index:  i.ID,
			Name:   i.Name,
			Target: i.Target,
			Goal:   i.Goal,
			Code:   i.Code,
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"success": true,
		"data":    response,
	})
}

func AddWallet(c *fiber.Ctx) error {
	wx := new(models.Wallet)

	if err := c.BodyParser(&wx); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	UID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.SendStatus(401)
	}

	wx.UserID = UID
	config.DB.Create(&wx)
	return c.Status(201).JSON(wx)
}

func UpdWallat(c *fiber.Ctx) error {
	wx := new(models.Wallet)

	UID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.SendStatus(401)
	}

	WID := c.Params("walletID")
	if err := c.BodyParser(wx); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	config.DB.Where("user_id = ? AND id = ?", UID, WID).Updates(&wx)
	return c.Status(200).JSON(wx)
}

func DelWallet(c *fiber.Ctx) error {
	WID := c.Params("walletID")
	var wx models.Wallet

	UID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.SendStatus(401)
	}

	result := config.DB.Where("user_id = ? AND id = ?", UID, WID).Delete(&wx)

	if result.RowsAffected == 0 {
		return c.SendStatus(404)
	}

	return c.SendStatus(200)
}
