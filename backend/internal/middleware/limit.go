package middleware

import (
	"log"

	"github.com/CaioIOX/rpg-manager/backend/internal/repository"
	"github.com/gofiber/fiber/v2"
)

func DocumentLimit(userRepo *repository.UserRepository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, ok := c.Locals("user_id").(string)
		if !ok || userID == "" {
			log.Printf("[LIMIT MIDDLEWARE] Erro: usuário não autenticado.")
			return c.Status(401).JSON(fiber.Map{"error": "Não autorizado."})
		}

		user, err := userRepo.GetByID(c.Context(), userID)
		if err != nil {
			log.Printf("[LIMIT MIDDLEWARE] Erro ao recuperar usuário %s: %v", userID, err)
			return c.Status(500).JSON(fiber.Map{"error": "Erro interno ao processar limites de conta."})
		}

		if user.IsPremium {
			return c.Next()
		}

		if user.DocumentCount >= 15 {
			log.Printf("[LIMIT MIDDLEWARE] Usuário %s excedeu o limite de documentos (contagem: %d).", userID, user.DocumentCount)
			return c.Status(403).JSON(fiber.Map{"error": "Limite de documentos atingido (15). Seja premium para documentos ilimitados!"})
		}

		return c.Next()
	}
}
