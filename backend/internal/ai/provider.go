package ai

import "context"

// Message representa uma mensagem no histórico de chat enviado à IA.
type Message struct {
	Role    string // "user" ou "model"
	Content string
}

// DocumentContext representa um documento da campanha a ser injetado no contexto.
type DocumentContext struct {
	ID    string
	Title string
	Text  string
}

// ChatRequest encapsula tudo que o provider precisa para gerar uma resposta.
type ChatRequest struct {
	UserMessage string
	Documents   []DocumentContext
	History     []Message
}

// ChatResponse encapsula a resposta gerada pela IA.
type ChatResponse struct {
	Content string
}

// Provider define a interface para qualquer provedor de IA que o Lorena pode usar.
// Permite trocar entre Gemini, Groq, OpenRouter etc. sem alterar o resto do código.
type Provider interface {
	Chat(ctx context.Context, req ChatRequest) (*ChatResponse, error)
}
