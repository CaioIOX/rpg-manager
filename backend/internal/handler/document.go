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

type DocumentHandler struct {
	documentService *service.DocumentService
	validate        *validator.Validate
}

func NewDocumentHandler(documentService *service.DocumentService, valdiate *validator.Validate) *DocumentHandler {
	return &DocumentHandler{documentService: documentService, validate: valdiate}
}

func (h *DocumentHandler) Create(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	loggedUser := c.Locals("user_id").(string)

	input := dto.CreateDocumentRequest{}
	if err := c.BodyParser(&input); err != nil {
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Requisição inválida.")
		return c.Status(400).JSON(fiber.Map{"error": "Requisição inválida."})
	}

	if err := h.validate.Struct(input); err != nil {
		log.Printf("Erro na requisição [Status %d]: %v", 400, err)
		return c.Status(400).JSON(fiber.Map{"eror": err.Error()})
	}

	newDocs := h.documentService.Create(c.Context(), input, campaignID, loggedUser)

	if newDocs != nil {
		if errors.Is(newDocs, customErrors.ErrUnauthorized) {
			log.Printf("Erro na requisição [Status %d]: %v", 401, customErrors.ErrUnauthorized)
			return c.Status(401).JSON(fiber.Map{"error": customErrors.ErrUnauthorized})
		}
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Erro ao tentar criar um documento.")
		return c.Status(400).JSON(fiber.Map{"error": "Erro ao tentar criar um documento."})
	}

	return c.Status(201).JSON(fiber.Map{"message": "Documento criado com sucesso!"})
}

func (h *DocumentHandler) List(c *fiber.Ctx) error {
	loggedUser := c.Locals("user_id").(string)
	campaignID := c.Params("campaign_id")

	docs, err := h.documentService.GetByCampaign(c.Context(), campaignID, loggedUser)
	if err != nil {
		log.Printf("Erro na requisição [Status %d]: %v", 500, "Falha ao listar os documentos.")
		return c.Status(500).JSON(fiber.Map{"error": "Falha ao listar os documentos."})
	}
	return c.JSON(docs)
}

func (h *DocumentHandler) Get(c *fiber.Ctx) error {
	campaignID := c.Params("campaign_id")
	docID := c.Params("document_id")
	loggedUser := c.Locals("user_id").(string)

	doc, err := h.documentService.GetByID(c.Context(), docID, campaignID, loggedUser)
	if err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			log.Printf("Erro na requisição [Status %d]: %v", 401, customErrors.ErrUnauthorized)
			return c.Status(401).JSON(fiber.Map{"error": customErrors.ErrUnauthorized})
		}
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Documento não encontardo.")
		return c.Status(400).JSON(fiber.Map{"error": "Documento não encontardo."})
	}

	return c.JSON(doc)
}

func (h *DocumentHandler) Update(c *fiber.Ctx) error {
	loggedUser := c.Locals("user_id").(string)
	campaignID := c.Params("campaign_id")
	docId := c.Params("document_id")

	input := dto.UpdateDocumentRequest{}
	if err := c.BodyParser(&input); err != nil {
		log.Printf("Erro na requisição [Status %d]: %v", 400, err)
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	if err := h.validate.Struct(input); err != nil {
		log.Printf("Erro na requisição [Status %d]: %v", 400, err)
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	doc, err := h.documentService.Update(c.Context(), input, campaignID, docId, loggedUser)
	if err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			log.Printf("Erro na requisição [Status %d]: %v", 401, customErrors.ErrUnauthorized)
			return c.Status(401).JSON(fiber.Map{"error": customErrors.ErrUnauthorized})
		}
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Erro ao tentar atualziar documento.")
		return c.Status(400).JSON(fiber.Map{"error": "Erro ao tentar atualziar documento."})
	}
log.Println(doc)
	return c.JSON(doc)
}

func (h *DocumentHandler) Delete(c *fiber.Ctx) error {
	loggedUser := c.Locals("user_id").(string)
	campaignID := c.Params("campaign_id")
	docID := c.Params("document_id")

	if err := h.documentService.Delete(c.Context(), docID, campaignID, loggedUser); err != nil {
		if errors.Is(err, customErrors.ErrUnauthorized) {
			log.Printf("Erro na requisição [Status %d]: %v", 401, err)
			return c.Status(401).JSON(fiber.Map{"error": err.Error()})
		}
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Erro ao tentar apagar documento.")
		return c.Status(400).JSON(fiber.Map{"error": "Erro ao tentar apagar documento."})
	}

	return c.Status(204).Send(nil)

}

func (h *DocumentHandler) GetLinks(c *fiber.Ctx) error {
	loggedUser := c.Locals("user_id").(string)
	docID := c.Params("document_id")
	campaignID := c.Params("campaign_id")

	linksFrom, err := h.documentService.GetLinksFrom(c.Context(), docID, campaignID, loggedUser)
	if err != nil {
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Falha ao recuperar menções")
		return c.Status(400).JSON(fiber.Map{"error": "Falha ao recuperar menções"})
	}

	linksTo, err := h.documentService.GetLinksTo(c.Context(), docID, campaignID, loggedUser)
	if err != nil {
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Falha ao recuperar menções")
		return c.Status(400).JSON(fiber.Map{"error": "Falha ao recuperar menções"})
	}

	return c.JSON(fiber.Map{
		"links_from": linksFrom,
		"links_to":   linksTo,
	})
}

func (h *DocumentHandler) Search(c *fiber.Ctx) error {
	loggedUser := c.Locals("user_id").(string)
	campaignID := c.Params("campaign_id")
	query := c.Query("q")

	if query == "" {
		log.Printf("Erro na requisição [Status %d]: %v", 400, "Consulta não encontrada.")
		return c.Status(400).JSON(fiber.Map{"error": "Consulta não encontrada."})
	}

	docs, err := h.documentService.SearchByTitle(c.Context(), query, campaignID, loggedUser)
	if err != nil {
		log.Printf("Erro na requisição [Status %d]: %v", 500, "Consulta não encontrada.")
		return c.Status(500).JSON(fiber.Map{"error": "Consulta não encontrada."})
	}

	return c.JSON(docs)
}
