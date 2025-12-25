package main

import (
	"log"
	"os"

	"github.com/MadMax168/CloudPocket.git/config"
	"github.com/MadMax168/CloudPocket.git/models"
	"github.com/MadMax168/CloudPocket.git/routes"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load("../.env"); err != nil {
		log.Println("No .env file found")
	}

	config.Connect()

	config.DB.AutoMigrate(
		&models.User{},
		&models.Wallet{},
		&models.Transaction{},
		&models.WalletShare{},
	)

	app := fiber.New()

	// CRITICAL: Add CORS before routes
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowCredentials: true,
	}))

	routes.SetAllRoutes(app)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000" // Default for local development
	}

	log.Println("Server starting on :8000")
	app.Listen(":" + port)
}
