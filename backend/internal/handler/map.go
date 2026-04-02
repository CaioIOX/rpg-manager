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

type MapHandler struct {
	mapService *service.MapService
	validate   *validator.Validate
}

func NewMapHandler(mapService *service.MapService, validate *validator.Validate) *MapHandler {
	return &MapHandler{mapService: mapService, validate: validate}
}

func (h *MapHandler) Upload(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	userID := c.Locals("user_id").(string)

	name := c.FormValue("name")
	if name == "" {
		name = "Novo Mapa"
	}

	fileHeader, err := c.FormFile("file")
	if err != nil {
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Arquivo não encontrado na requisição.")
		return c.Status(400).JSON(fiber.Map{"error": "Arquivo não encontrado na requisição."})
	}

	file, err := fileHeader.Open()
	if err != nil {
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Erro ao abrir arquivo.")
		return c.Status(400).JSON(fiber.Map{"error": "Erro ao abrir arquivo."})
	}
	defer file.Close()

	m, err := h.mapService.Upload(c.Context(), campaignID, userID, name, file, fileHeader.Size)
	if err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			log.Printf("Erro na requisição [Status %d]: %v", 401, err)
			return c.Status(401).JSON(fiber.Map{"error": customErrors.ErrUnauthorized.Error()})
		}
		log.Printf("Erro na requisição [Status %d]: %v", 400, err.Error())
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(201).JSON(m)
}

func (h *MapHandler) List(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	userID := c.Locals("user_id").(string)

	maps, err := h.mapService.GetByCampaign(c.Context(), campaignID, userID)
	if err != nil {
		log.Printf("Erro na requisição [Status %d]: %v", 500, "Falha ao listar mapas.")
		return c.Status(500).JSON(fiber.Map{"error": "Falha ao listar mapas."})
	}
	return c.JSON(maps)
}

func (h *MapHandler) Get(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	mapID := c.Params("map_id")
	userID := c.Locals("user_id").(string)

	detail, err := h.mapService.GetDetail(c.Context(), mapID, campaignID, userID)
	if err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": customErrors.ErrUnauthorized.Error()})
		}
		log.Printf("Erro na requisição [Status %d]: %v", 400, err.Error())
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(detail)
}

func (h *MapHandler) ServeImage(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	mapID := c.Params("map_id")
	userID := c.Locals("user_id").(string)

	filePath, err := h.mapService.GetFilePath(c.Context(), mapID, campaignID, userID)
	if err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": customErrors.ErrUnauthorized.Error()})
		}
		return c.Status(404).JSON(fiber.Map{"error": "Imagem não encontrada."})
	}

	c.Set("Cache-Control", "private, max-age=86400")
	return c.SendFile(filePath)
}

func (h *MapHandler) Update(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	mapID := c.Params("map_id")
	userID := c.Locals("user_id").(string)

	var input dto.UpdateMapRequest
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Requisição inválida."})
	}
	if err := h.validate.Struct(input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	updated, err := h.mapService.Update(c.Context(), mapID, campaignID, userID, input)
	if err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": customErrors.ErrUnauthorized.Error()})
		}
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}
	return c.JSON(updated)
}

func (h *MapHandler) Delete(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	mapID := c.Params("map_id")
	userID := c.Locals("user_id").(string)

	if err := h.mapService.Delete(c.Context(), mapID, campaignID, userID); err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": customErrors.ErrUnauthorized.Error()})
		}
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}
	return c.Status(204).Send(nil)
}

func (h *MapHandler) SyncMarkers(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	mapID := c.Params("map_id")
	userID := c.Locals("user_id").(string)

	var input dto.SyncMarkersRequest
	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Requisição inválida."})
	}

	if err := h.mapService.SyncMarkers(c.Context(), mapID, campaignID, userID, input); err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			return c.Status(401).JSON(fiber.Map{"error": customErrors.ErrUnauthorized.Error()})
		}
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(200).JSON(fiber.Map{"message": "Marcadores sincronizados com sucesso!"})
}
