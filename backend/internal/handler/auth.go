package handler

import (
	"errors"

	"github.com/CaioIOX/rpg-manager/backend/internal/customErrors"
	"github.com/CaioIOX/rpg-manager/backend/internal/dto"
	"github.com/CaioIOX/rpg-manager/backend/internal/service"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type AuthHandler struct {
	authService *service.AuthService
	validate    *validator.Validate
}

func NewAuthHandler(authService *service.AuthService, validate *validator.Validate) *AuthHandler {
	return &AuthHandler{authService: authService, validate: validate}
}

func (h *AuthHandler) Register(c *fiber.Ctx) error {
	input := dto.RegisterInput{}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Requisição inválida!"})
	}

	if err := h.validate.Struct(input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	resp := h.authService.Register(c.Context(), input)

	if resp != nil {
		if errors.Is(resp, customErrors.ErrEmailAlreadyExists) || errors.Is(resp, customErrors.ErrUsernameAlreadyExists) {
			return c.Status(409).JSON(fiber.Map{"error": resp.Error()})
		}
		return c.Status(400).JSON(fiber.Map{"error": "Erro ao tentar registrar, tente novamente!"})
	}

	return c.Status(201).JSON(fiber.Map{"message": "Conta criada com sucesso!"})
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	input := dto.LoginInput{}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Requisição inválida!"})
	}

	if err := h.validate.Struct(input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	resp, err := h.authService.Login(c.Context(), input)

	if err != nil {
		if errors.Is(err, customErrors.ErrInvalidCredentials) {
			return c.Status(401).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	c.Cookie(&fiber.Cookie{
		Name:     "token",
		Value:    resp,
		HTTPOnly: true,
		SameSite: "strict",
	})

	return c.JSON(fiber.Map{"message": "Login realizado com sucesso!"})
}
