package handler

import (
	"errors"
	"log"

	"github.com/CaioIOX/rpg-manager/backend/internal/customErrors"
	"github.com/CaioIOX/rpg-manager/backend/internal/dto"
	"github.com/CaioIOX/rpg-manager/backend/internal/service"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

// ChatHandler lida com as requisições HTTP do chatbot Lorena.
type ChatHandler struct {
	chatService *service.ChatService
	validate    *validator.Validate
}

func NewChatHandler(chatService *service.ChatService, validate *validator.Validate) *ChatHandler {
	return &ChatHandler{chatService: chatService, validate: validate}
}

// Send processa uma mensagem do usuário para a Lorena e retorna a resposta.
// POST /api/campaigns/:campaign_id/chat
func (h *ChatHandler) Send(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	loggedUser := c.Locals("user_id").(string)

	var input dto.ChatRequest
	if err := c.BodyParser(&input); err != nil {
		log.Printf("[CHAT] Erro ao parsear requisição: %v", err)
		return c.Status(400).JSON(fiber.Map{"error": "Requisição inválida."})
	}

	if err := h.validate.Struct(input); err != nil {
		log.Printf("[CHAT] Erro de validação: %v", err)
		return c.Status(400).JSON(fiber.Map{"error": "Mensagem inválida ou muito longa (máximo 2000 caracteres)."})
	}

	resp, err := h.chatService.Send(c.Context(), campaignID, loggedUser, input)
	if err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": "Você não tem acesso a esta campanha."})
		}
		if errors.Is(err, service.ErrRateLimitExceeded) {
			log.Printf("[CHAT] Rate limit atingido para usuário %s", loggedUser)
			return c.Status(429).JSON(dto.ChatRateLimitResponse{
				Error:         "Lorena está cansada por hoje, volte amanhã para mais consultas! 📚",
				MessagesUsed:  service.FreeDailyLimit,
				MessagesLimit: service.FreeDailyLimit,
			})
		}
		log.Printf("[CHAT] Erro ao processar mensagem: %v", err)
		return c.Status(500).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(resp)
}

// GetUsage retorna o uso diário do chatbot para o usuário atual.
// GET /api/campaigns/:campaign_id/chat/usage
func (h *ChatHandler) GetUsage(c *fiber.Ctx) error {
	loggedUser := c.Locals("user_id").(string)

	used, limit, err := h.chatService.GetDailyUsage(c.Context(), loggedUser)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Erro ao recuperar uso do chatbot."})
	}

	return c.JSON(fiber.Map{
		"messages_used":  used,
		"messages_limit": limit, // -1 = ilimitado (premium)
	})
}
