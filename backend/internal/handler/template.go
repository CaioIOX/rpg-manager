package handler

import (
	"errors"

	"github.com/CaioIOX/rpg-manager/backend/internal/customErrors"
	"github.com/CaioIOX/rpg-manager/backend/internal/dto"
	"github.com/CaioIOX/rpg-manager/backend/internal/service"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type TemplateHandler struct {
	templateService *service.TemplateService
	validate        *validator.Validate
}

func NewTemplateHandler(templateService *service.TemplateService, validate *validator.Validate) *TemplateHandler {
	return &TemplateHandler{templateService: templateService, validate: validate}
}

func (h *TemplateHandler) Create(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	loggedUser := c.Locals("user_id").(string)

	input := dto.CreateTemplateRequest{}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Requisição inválida."})
	}

	if err := h.validate.Struct(input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	newTemplate := h.templateService.Create(c.Context(), input, campaignID, loggedUser)

	if newTemplate != nil {
		if errors.Is(newTemplate, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": customErrors.ErrUnauthorized})
		}
		return c.Status(400).JSON(fiber.Map{"error": "Erro ao tentar criar um template."})
	}

	return c.Status(201).JSON(fiber.Map{"message": "Template criado com sucesso!"})
}

func (h *TemplateHandler) List(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	loggedUser := c.Locals("user_id").(string)

	tmpl, err := h.templateService.GetByCampaign(c.Context(), campaignID, loggedUser)
	if err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": customErrors.ErrUnauthorized})
		}
		return c.Status(400).JSON(fiber.Map{"error": "Erro ao tentar listar os templates."})
	}

	return c.JSON(tmpl)
}

func (h *TemplateHandler) Get(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	templateID := c.Params("template_id")
	loggedUser := c.Locals("user_id").(string)

	tmpl, err := h.templateService.GetByID(c.Context(), templateID, campaignID, loggedUser)
	if err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": customErrors.ErrUnauthorized})
		}
		return c.Status(400).JSON(fiber.Map{"error": "Erro ao tentar acessar o template."})
	}

	return c.JSON(tmpl)
}

func (h *TemplateHandler) Update(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	templateID := c.Params("template_id")
	loggedUser := c.Locals("user_id").(string)

	input := dto.UpdateTemplateRequest{}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	if err := h.validate.Struct(input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	tmpl, err := h.templateService.Update(c.Context(), input, templateID, campaignID, loggedUser)
	if err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": customErrors.ErrUnauthorized})
		}
		return c.Status(400).JSON(fiber.Map{"Error": "Erro ao tentar atualizar o template."})
	}

	return c.JSON(tmpl)
}

func (h *TemplateHandler) Delete(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	templateID := c.Params("template_id")
	loggedUser := c.Locals("user_id").(string)

	if err := h.templateService.Delete(c.Context(), templateID, campaignID, loggedUser); err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": customErrors.ErrUnauthorized})
		}
		return c.Status(400).JSON(fiber.Map{"Error": "Erro ao tentar apagar o template."})
	}

	return c.Status(204).Send(nil)
}
