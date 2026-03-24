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
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Campanhas não encontradas.")
		return c.Status(400).JSON(fiber.Map{"error": "Campanhas não encontradas."})
	}

	return c.Status(200).JSON(campaigns)
}

func (h *CampaignHandler) Get(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	loggedUser := c.Locals("user_id").(string)

	campaign, err := h.campaignService.GetByID(c.Context(), campaignID, loggedUser)
	if err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			log.Printf("Erro na requisição [Status %d]: %v", 401, "Você não é membro dessa campanha!")
			return c.Status(401).JSON(fiber.Map{"error": "Você não é membro dessa campanha!"})
		}
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Campanha não encontrada.")
		return c.Status(400).JSON(fiber.Map{"error": "Campanha não encontrada."})
	}

	return c.JSON(campaign)
}

func (h *CampaignHandler) Create(c *fiber.Ctx) error {
	loggedUser := c.Locals("user_id").(string)

	input := dto.CreateCampaignRequest{}
	if err := c.BodyParser(&input); err != nil {
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Requisição inválida.")
		return c.Status(400).JSON(fiber.Map{"error": "Requisição inválida."})
	}

	if err := h.validate.Struct(input); err != nil {
		log.Printf("Erro na requisição [Status %d]: %v", 400, err)
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	newCampaign := h.campaignService.Create(c.Context(), input, loggedUser)

	if newCampaign != nil {
		if errors.Is(newCampaign, customErrors.ErrUnauthorized) {
			log.Printf("Erro na requisição [Status %d]: %v", 401, newCampaign)
			return c.Status(401).JSON(fiber.Map{"error": newCampaign.Error()})
		}
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Erro ao tentar criar campanha.")
		return c.Status(400).JSON(fiber.Map{"error": "Erro ao tentar criar campanha."})
	}

	return c.Status(201).JSON(fiber.Map{"message": "Campanha criada com sucesso!"})
}

func (h *CampaignHandler) AddMember(c *fiber.Ctx) error {
	id := c.Params("campaign_id")
	loggedUser := c.Locals("user_id").(string)

	input := dto.AddMemberRequest{}
	if err := c.BodyParser(&input); err != nil {
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Requisição inválida.")
		return c.Status(400).JSON(fiber.Map{"error": "Requisição inválida."})
	}

	if err := h.validate.Struct(input); err != nil {
		log.Printf("Erro na requisição [Status %d]: %v", 400, err)
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	newMember := h.campaignService.AddMember(c.Context(), input, id, loggedUser)
	if newMember != nil {
		if errors.Is(newMember, customErrors.ErrUnauthorized) {
			log.Printf("Erro na requisição [Status %d]: %v", 401, newMember)
			return c.Status(401).JSON(fiber.Map{"error": newMember.Error()})
		}
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Erro ao tentar adicionar membro.")
		return c.Status(400).JSON(fiber.Map{"error": "Erro ao tentar adicionar membro."})
	}
	return c.Status(200).JSON(fiber.Map{"message": "Membro adicionado com sucesso!"})
}

func (h *CampaignHandler) Update(c *fiber.Ctx) error {
	id := c.Params("campaign_id")
	loggedUser := c.Locals("user_id").(string)

	input := dto.UpdateCampaignRequest{}
	if err := c.BodyParser(&input); err != nil {
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Requisição inválida!")
		return c.Status(400).JSON(fiber.Map{"errors": "Requisição inválida!"})
	}

	if err := h.validate.Struct(input); err != nil {
		log.Printf("Erro na requisição [Status %d]: %v", 400, err)
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	campaign, err := h.campaignService.Update(c.Context(), id, input, loggedUser)
	if err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			log.Printf("Erro na requisição [Status %d]: %v", 401, err)
			return c.Status(401).JSON(fiber.Map{"error": err.Error()})
		}
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Erro ao tentar atualizar campanha!")
		return c.Status(400).JSON(fiber.Map{"error": "Erro ao tentar atualizar campanha!"})
	}

	return c.JSON(campaign)
}

func (h *CampaignHandler) Delete(c *fiber.Ctx) error {
	id := c.Params("campaign_id")
	loggedUser := c.Locals("user_id").(string)

	if err := h.campaignService.Delete(c.Context(), id, loggedUser); err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			log.Printf("Erro na requisição [Status %d]: %v", 401, err)
			return c.Status(401).JSON(fiber.Map{"error": err.Error()})
		}
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Erro ao tentar apagar campanha!")
		return c.Status(400).JSON(fiber.Map{"error": "Erro ao tentar apagar campanha!"})
	}

	return c.Status(204).Send(nil)
}
