package handler

import (
	"github.com/MadMax168/CloudPocket.git/config"
	"github.com/MadMax168/CloudPocket.git/models"
	"github.com/MadMax168/CloudPocket.git/middleware"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func GetMe(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.SendStatus(401)
	}
	var usr models.User

	result := config.DB.First(&usr, UID)

	if result.RowsAffected == 0 {
		return c.SendStatus(404)
	}

	return c.Status(200).JSON(&usr)
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(c *fiber.Ctx) error {
	input := new(LoginInput)

	if err := c.BodyParser(input); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	var user models.User
	config.DB.Where("email = ?", input.Email).First(&user)

	if user.ID == 0 {
		return c.Status(404).JSON(fiber.Map{"message": "User not found"})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		return c.Status(401).JSON(fiber.Map{"message": "Incorrect password"})
	}

	token, err := middleware.GenerateToken(user.ID)
	if err != nil {
		return c.SendStatus(500)
	}

	return c.JSON(fiber.Map{"token": token})
}

func Register(c *fiber.Ctx) error {
	usr := new(models.User)

	if err := c.BodyParser(&usr); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(usr.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.SendStatus(500)
	}
	usr.Password = string(hashedPassword)

	config.DB.Create(&usr)
	return c.Status(201).JSON(usr)
}

type PasswordUpdate struct {
	OldPassword string `json:"old_password"`
	NewPassword string `json:"new_password"`
}

func UpdPass(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.SendStatus(401)
	}

	input := new(PasswordUpdate)

	if err := c.BodyParser(input); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	var user models.User
	config.DB.First(&user, UID)

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.OldPassword)); err != nil {
		return c.Status(401).JSON(fiber.Map{"message": "Incorrect old password"})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return c.SendStatus(500)
	}

	config.DB.Model(&user).Update("password", string(hashedPassword))
	return c.Status(200).JSON(fiber.Map{"message": "Password updated successfully"})
}

type EmailUpdate struct {
	Email string `json:"email"`
}

func UpdEmail(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.SendStatus(401)
	}

	input := new(EmailUpdate)
	if err := c.BodyParser(input); err != nil {
		return c.Status(400).SendString(err.Error())
	}

	var user models.User
	config.DB.First(&user, UID)

	config.DB.Model(&user).Update("email", input.Email)
	return c.Status(200).JSON(user)
}

func DelUser(c *fiber.Ctx) error {
	UID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.SendStatus(401)
	}
	var usr models.User

	result := config.DB.Delete(&usr, UID)

	if result.RowsAffected == 0 {
		return c.SendStatus(404)
	}

	return c.SendStatus(200)
}