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

	// Transaction routes
	api.Get("/wallets/:walletID/transactions", handler.GetTrans)
	api.Post("/wallets/:walletID/transactions", handler.AddTrans)
	api.Put("wallets/:walletID/transactions/:id", handler.UpdTrans)
	api.Delete("wallets/:walletID/transactions/:id", handler.DelTrans)
}