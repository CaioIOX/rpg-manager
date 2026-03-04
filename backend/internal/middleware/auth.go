package middleware

import (
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func AuthRequired(c *fiber.Ctx) error {
	jwtSecret := os.Getenv("JWT_SECRET")
	tokenString := c.Cookies("token")

	if tokenString == "" {
		return c.Status(401).JSON(fiber.Map{"error": "Não autorizado!"})
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.NewError(fiber.StatusUnauthorized, "Método de assinatura inválido!")
		}
		return []byte(jwtSecret), nil
	})

	if err != nil || !token.Valid {
		return c.Status(401).JSON(fiber.Map{"error": "Token inválido ou expirado, faça login novamente!"})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(401).JSON(fiber.Map{"error": "Token inválido!"})
	}

	userID := claims["user_id"]

	c.Locals("user_id", userID)
	return c.Next()
}