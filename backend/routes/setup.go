package routes

import (
	handler "github.com/MadMax168/CloudPocket.git/handlers"
	"github.com/MadMax168/CloudPocket.git/middleware"
	"github.com/gofiber/fiber/v2"
)

func SetAllRoutes(app *fiber.App) {
	app.Post("/register", handler.Register)
	app.Post("/login", handler.Login)

	api := app.Group("/api", middleware.AuthMiddleware)

	// User routes
	api.Get("/me", handler.GetMe)
	api.Put("/me/password", handler.UpdPass)
	api.Put("/me/email", handler.UpdEmail)
	api.Delete("/me", handler.DelUser)

	// Wallet routes
	api.Get("/wallets", handler.GetWallet)
	api.Post("/wallets", handler.AddWallet)
	api.Put("/wallets/:walletID", handler.UpdWallat)
	api.Delete("/wallets/:walletID", handler.DelWallet)

	// Transaction routes - Now with sharing permissions
	api.Get("/wallets/:walletID/transactions", middleware.CheckWalletAccess("read"), handler.GetTrans)
	api.Post("/wallets/:walletID/transactions", middleware.CheckWalletAccess("write"), handler.AddTrans)
	api.Put("/wallets/:walletID/transactions/:id", middleware.CheckWalletAccess("write"), handler.UpdTrans)
	api.Delete("/wallets/:walletID/transactions/:id", middleware.CheckWalletAccess("write"), handler.DelTrans)

	// Sharing routes
	api.Post("/wallets/:walletID/share", handler.ShareWallet) // Share with user
	api.Get("/shared-wallets", handler.GetSharedWallets)      // Get wallets shared with me
	api.Get("/pending-shares", handler.GetPendingShares)      // Get pending invitations
	api.Put("/shares/:shareID", handler.RespondToShare)       // Accept/reject invitation
}
