package utils

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func StrToUint(str string) (uint, error) {
	if str == "" {
		return 0, fiber.NewError(400, "Value cannot be empty")
	}

	parsed, err := strconv.ParseUint(str, 10, 32)
	if err != nil {
		return 0, fiber.NewError(400, "Value cannot be empty")
	}

	return uint(parsed), nil
}

func GetUint(c *fiber.Ctx, key string) (uint, error) {
	str := c.Params(key)
	return StrToUint(str)
}
