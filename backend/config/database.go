package config

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	var dsn string

	// Check if DATABASE_URL exists (Render provides this)
	databaseURL := os.Getenv("DATABASE_URL")

	if databaseURL != "" {
		// Render PostgreSQL format
		log.Println("Connecting with DATABASE_URL")
		dsn = databaseURL
	} else {
		// Local development format
		log.Println("Connecting with individual environment variables")
		dsn = fmt.Sprintf(
			"host=%s user=%s password=%s dbname=%s port=%s sslmode=require TimeZone=UTC",
			os.Getenv("DB_HOST"),
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_NAME"),
			getEnvWithDefault("DB_PORT", "5432"),
		)
	}

	log.Printf("Attempting to connect to database...")

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Printf("Database connection error: %v", err)
		log.Printf("DSN used: %s", maskSensitiveData(dsn))
		panic("Can't connect DB")
	}

	log.Println("Database connected successfully!")
	DB = database
}

// Helper function to get environment variable with default value
func getEnvWithDefault(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

// Helper function to mask sensitive data in logs
func maskSensitiveData(dsn string) string {
	// Simple masking - you can improve this
	if len(dsn) > 50 {
		return dsn[:30] + "..." + dsn[len(dsn)-20:]
	}
	return "***masked***"
}
