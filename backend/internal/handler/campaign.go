package handler

import (
	"errors"

	"github.com/CaioIOX/rpg-manager/backend/internal/customErrors"
	"github.com/CaioIOX/rpg-manager/backend/internal/dto"
	"github.com/CaioIOX/rpg-manager/backend/internal/service"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type CampaignHandler struct {
	campaignService *service.CampaignService
	validate        *validator.Validate
}

func NewCampaignHandler(campaignService *service.CampaignService, validate *validator.Validate) *CampaignHandler {
	return &CampaignHandler{campaignService: campaignService, validate: validate}
}

func (h *CampaignHandler) List(c *fiber.Ctx) error {
	loggedUser := c.Locals("user_id").(string)

	campaigns, err := h.campaignService.GetByUser(c.Context(), loggedUser)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Campanhas não encontradas."})
	}

	return c.Status(200).JSON(campaigns)
}

func (h *CampaignHandler) Get(c *fiber.Ctx) error {
	id := c.Params("id")
	loggedUser := c.Locals("user_id").(string)

	campaign, err := h.campaignService.GetByID(c.Context(), id, loggedUser)
	if err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": "Você não é membro dessa campanha!"})
		}
		return c.Status(400).JSON(fiber.Map{"error": "Campanha não encontrada."})
	}

	return c.JSON(campaign)
}

func (h *CampaignHandler) Create(c *fiber.Ctx) error {
	loggedUser := c.Locals("user_id").(string)

	input := dto.CreateCampaignRequest{}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Requisição inválida."})
	}

	if err := h.validate.Struct(input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	newCampaign := h.campaignService.Create(c.Context(), input, loggedUser)

	if newCampaign != nil {
		if errors.Is(newCampaign, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": newCampaign.Error()})
		}
		return c.Status(400).JSON(fiber.Map{"error": "Erro ao tentar criar campanha."})
	}

	return c.Status(201).JSON(fiber.Map{"message": "Camapanha criada com sucesso!"})
}

func (h *CampaignHandler) AddMember(c *fiber.Ctx) error {
	id := c.Params("id")
	loggedUser := c.Locals("user_id").(string)

	input := dto.AddMemberRequest{}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Requisição inválida."})
	}

	if err := h.validate.Struct(input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	newMember := h.campaignService.AddMember(c.Context(), input, id, loggedUser)
	if newMember != nil {
		if errors.Is(newMember, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": newMember.Error()})
		}
		return c.Status(400).JSON(fiber.Map{"error": "Erro ao tentar adicionar membro."})
	}
	return c.Status(200).JSON(fiber.Map{"message": "Membro adicionado com sucesso!"})
}

func (h *CampaignHandler) Update(c *fiber.Ctx) error {
	id := c.Params("id")
	loggedUser := c.Locals("user_id").(string)

	input := dto.UpdateCampaignRequest{}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"errors": "Requisição inválida!"})
	}

	if err := h.validate.Struct(input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	campaign, err := h.campaignService.Update(c.Context(), id, input, loggedUser)
	if err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(400).JSON(fiber.Map{"errors": "Erro ao tentar atualizar campanha!"})
	}

	return c.JSON(campaign)
}

func (h *CampaignHandler) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	loggedUser := c.Locals("user_id").(string)

	if err := h.campaignService.Delete(c.Context(), id, loggedUser); err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(400).JSON(fiber.Map{"errors": "Erro ao tentar apagar campanha!"})
	}

	return c.Status(204).Send(nil)
}
