package ws

import (
	"log"
	"sync"

	"github.com/gofiber/websocket/v2"
)

type Client struct {
	Conn   *websocket.Conn
	DocID  string
	UserID string
	Name   string
	mu     sync.Mutex
}

func (c *Client) Write(messageType int, data []byte) error {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.Conn.WriteMessage(messageType, data)
}

type Hub struct {
	mu    sync.RWMutex
	rooms map[string]map[*Client]bool
}

func NewHub() *Hub {
	return &Hub{
		rooms: make(map[string]map[*Client]bool),
	}
}

func (h *Hub) Register(client *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if h.rooms[client.DocID] == nil {
		h.rooms[client.DocID] = make(map[*Client]bool)
	}

	h.rooms[client.DocID][client] = true
	log.Printf("[WS] %s se juntou ao documento %s (tamanho da sala: %d)", client.UserID, client.DocID, len(h.rooms[client.DocID]))
}

func (h *Hub) Unregister(client *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if room, ok := h.rooms[client.DocID]; ok {
		delete(room, client)
		if len(room) == 0 {
			delete(h.rooms, client.DocID)
		}
		log.Printf("[WS] %s deixou o documento %s", client.UserID, client.DocID)
	}
}

func (h *Hub) Broadcast(docID string, sender *Client, messageType int, message []byte) {
	if len(message) == 0 {
		return
	}
	h.mu.RLock()
	defer h.mu.RUnlock()

	room, ok := h.rooms[docID]
	if !ok {
		return
	}

	for client := range room {
		if client != sender {
			if err := client.Write(messageType, message); err != nil {
				log.Printf("[WS] Erro ao fazer broadcast à %s: %v", client.UserID, err)
			}
		}
	}
}
