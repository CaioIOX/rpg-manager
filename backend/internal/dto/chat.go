package dto

// ChatRequest é o body esperado na requisição POST /chat
type ChatRequest struct {
	Message string      `json:"message" validate:"required,min=1,max=2000"`
	History []HistoryMessage `json:"history"` // histórico vindo do frontend (in-memory)
}

// HistoryMessage representa uma mensagem no histórico de conversa enviada pelo frontend.
type HistoryMessage struct {
	Role    string `json:"role" validate:"required,oneof=user assistant"`
	Content string `json:"content" validate:"required"`
}

// ChatResponse é a resposta do endpoint POST /chat
type ChatResponse struct {
	Content string `json:"content"`
}

// ChatRateLimitResponse é retornado quando o usuário atingiu o limite diário.
type ChatRateLimitResponse struct {
	Error         string `json:"error"`
	MessagesUsed  int    `json:"messages_used"`
	MessagesLimit int    `json:"messages_limit"`
}
