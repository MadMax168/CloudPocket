package main

import (
	"github.com/MadMax168/CloudPocket.git/config"
	"github.com/MadMax168/CloudPocket.git/routes"
	"github.com/gofiber/fiber/v2"
)

func main() {
	config.Connect()

	app := fiber.New()

	routes.SetAllRoutes(app)

	app.Listen(":8000")
}
