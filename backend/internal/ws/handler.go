package ws

import (
	"context"
	"log"

	"github.com/CaioIOX/rpg-manager/backend/internal/repository"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

type Handler struct {
	docRepo *repository.DocumentRepository
}

func NewHandler(docRepo *repository.DocumentRepository) *Handler {
	return &Handler{docRepo: docRepo}
}

func (h *Handler) HandlerWs(hub *Hub) fiber.Handler {
	return websocket.New(func(c *websocket.Conn) {
		docID := c.Params("doc_id")
		userID := c.Locals("user_id").(string)
		username := c.Query("user_name", "Anonymous")

		if docID == "" || userID == "" {
			log.Printf("[ws] id do documento ou do usuário não existente")
			return
		}

		client := &Client{
			Conn:   c,
			DocID:  docID,
			UserID: userID,
			Name:   username,
		}

		hub.Register(client)
		defer hub.Unregister(client)

		document, err := h.docRepo.GetByID(context.Background(), docID)
		if err == nil && document.YjsState != nil {
			if err := client.Write(websocket.BinaryMessage, document.YjsState); err != nil {
				log.Printf("[WS] Erro enviando estado inicial: %v", err)
			}
		}

		for {
			messageType, message, err := client.Conn.ReadMessage()
			if err != nil {
				break
			}

			// Broadcast message to other clients in the same room
			hub.Broadcast(client.DocID, client, messageType, message)
		}
	})
}
