package middleware

import (
	"fmt"

	"github.com/MadMax168/CloudPocket.git/config"
	"github.com/MadMax168/CloudPocket.git/models"
	"github.com/MadMax168/CloudPocket.git/utils"
	"github.com/gofiber/fiber/v2"
)

func CheckWalletAccess(requiredPermission string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		UID, ok := c.Locals("userID").(uint)
		if !ok {
			return c.SendStatus(401)
		}

		walletID, err := utils.GetUint(c, "walletID")
		if err != nil {
			return c.Status(400).SendString("Invalid wallet ID")
		}

		// Debug: Add logging
		fmt.Printf("User %d trying to access wallet %d\n", UID, walletID)

		// Check if owner
		var wallet models.Wallet
		if err := config.DB.Where("user_id = ? AND id = ?", UID, walletID).First(&wallet).Error; err == nil {
			fmt.Printf("User %d is owner of wallet %d\n", UID, walletID)
			c.Locals("isOwner", true)
			c.Locals("permission", "write")
			return c.Next()
		}

		// Check if shared with user
		var share models.WalletShare
		if err := config.DB.Where("wallet_id = ? AND shared_with_id = ? AND status = ?",
			walletID, UID, "accepted").First(&share).Error; err == nil {

			fmt.Printf("User %d has shared access to wallet %d with permission %s\n", UID, walletID, share.Permission)

			if requiredPermission == "write" && share.Permission != "write" {
				return c.Status(403).JSON(fiber.Map{"message": "Insufficient permissions"})
			}

			c.Locals("isOwner", false)
			c.Locals("permission", share.Permission)
			return c.Next()
		}

		fmt.Printf("User %d has no access to wallet %d\n", UID, walletID)
		return c.Status(404).JSON(fiber.Map{"message": "Wallet not found or access denied"})
	}
}
