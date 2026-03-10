package handler

import (
	"errors"

	"github.com/CaioIOX/rpg-manager/backend/internal/customErrors"
	"github.com/CaioIOX/rpg-manager/backend/internal/dto"
	"github.com/CaioIOX/rpg-manager/backend/internal/service"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type FolderHandler struct {
	folderService *service.FolderService
	validate      *validator.Validate
}

func NewFolderHandler(folderService *service.FolderService, validate *validator.Validate) *FolderHandler {
	return &FolderHandler{folderService: folderService, validate: validate}
}

func (h *FolderHandler) List(c *fiber.Ctx) error {
	loggedUser := c.Locals("user_id").(string)
	campaignID := c.Params("campaign_id")

	folders, err := h.folderService.GetByCampaign(c.Context(), campaignID, loggedUser)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Pastas não encontradas."})
	}

	return c.Status(200).JSON(folders)
}

func (h *FolderHandler) Get(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	folderID := c.Params("folder_id")
	loggedUser := c.Locals("user_id").(string)

	folder, err := h.folderService.GetByID(c.Context(), campaignID, folderID, loggedUser)
	if err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": "Você não é membro dessa campanha!"})
		}
		return c.Status(400).JSON(fiber.Map{"error": "Pasta não encontrada."})
	}

	return c.JSON(folder)

}

func (h *FolderHandler) Create(c *fiber.Ctx) error {
	loggedUser := c.Locals("user_id").(string)
	campaignID := c.Params("campaign_id")

	input := dto.CreateFolderRequest{}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Requisição inválida."})
	}

	if err := h.validate.Struct(input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	newFolder := h.folderService.Create(c.Context(), input, campaignID, loggedUser)

	if newFolder != nil {
		if errors.Is(newFolder, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": newFolder.Error()})
		}
		return c.Status(400).JSON(fiber.Map{"error": "Erro ao tentar criar pasta."})
	}

	return c.Status(201).JSON(fiber.Map{"message": "Pasta criada com sucesso!"})
}

func (h *FolderHandler) Update(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	folderID := c.Params("folder_id")
	loggedUser := c.Locals("user_id").(string)

	input := dto.UpdateFolderRequest{}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"erros": "Requisição inválida!"})
	}

	if err := h.validate.Struct(input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	folder, err := h.folderService.Update(c.Context(), input, folderID, campaignID, loggedUser)
	if err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(400).JSON(fiber.Map{"errors": "Erro ao tenatr atualziar pasta."})
	}

	return c.JSON(folder)
}

func (h *FolderHandler) Delete(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	folderID := c.Params("folder_id")
	loggedUser := c.Locals("user_id").(string)

	if err := h.folderService.Delete(c.Context(), folderID, campaignID, loggedUser); err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": err.Error()})
		}
		return c.Status(400).JSON(fiber.Map{"errors": "Erro ao tentar apagar pasta."})
	}

	return c.Status(204).Send(nil)
}
