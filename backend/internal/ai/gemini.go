package ai

import (
	"context"
	"fmt"
	"strings"

	"google.golang.org/genai"
)

const geminiModel = "gemini-2.5-flash"

// systemInstruction é a persona e regras da Lorena — o grimório mímico.
const systemInstruction = `Você é **Lorena**, um grimório mímico que habita esta campanha de RPG. Você adora consumir e compartilhar conhecimento, e é a guardiã de todo o lore registrado nos documentos desta campanha.

## Regras Absolutas:
1. Responda APENAS com base nos documentos fornecidos abaixo como contexto — sua "biblioteca".
2. NUNCA invente, deduza ou alucine informações que não estejam explicitamente nos documentos.
3. Se não encontrar a informação nos documentos, responda algo como: "Hmm, folheei todas as minhas páginas e não encontrei nada sobre isso na biblioteca da campanha. Talvez ainda não tenha sido escrito..."
4. Sempre cite os documentos fonte ao final da resposta usando o formato: 📄 **Nome do Documento**
5. Seja concisa mas completa. Use formatação markdown para organizar respostas longas.
6. Responda no mesmo idioma da pergunta do usuário.
7. Se houver múltiplas informações relevantes em documentos diferentes, consolide-as em uma resposta coesa.`

// GeminiProvider implementa o Provider usando a API do Google Gemini.
type GeminiProvider struct {
	client *genai.Client
}

// NewGeminiProvider cria um novo provider Gemini com a API key fornecida.
func NewGeminiProvider(apiKey string) (*GeminiProvider, error) {
	if apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY não configurada")
	}

	client, err := genai.NewClient(context.Background(), &genai.ClientConfig{
		APIKey: apiKey,
	})
	if err != nil {
		return nil, fmt.Errorf("falha ao criar cliente Gemini: %w", err)
	}

	return &GeminiProvider{client: client}, nil
}

// Chat envia uma requisição ao Gemini com o contexto dos documentos da campanha.
func (p *GeminiProvider) Chat(ctx context.Context, req ChatRequest) (*ChatResponse, error) {
	// Construir o contexto completo com os documentos da campanha
	docsContext := buildDocumentsContext(req.Documents)

	// Montar o system prompt com a biblioteca de documentos
	fullSystemInstruction := systemInstruction + "\n\n## Sua Biblioteca — Documentos da Campanha:\n\n" + docsContext

	// Configuração do modelo com system instruction
	config := &genai.GenerateContentConfig{
		SystemInstruction: genai.NewContentFromText(fullSystemInstruction, "user"),
		Temperature:       genai.Ptr[float32](0.3), // Baixa temperatura = respostas mais factuais
		MaxOutputTokens:   2048,
	}

	// Converter histórico para o formato Content do Gemini
	history := buildHistory(req.History)

	// Criar sessão de chat com histórico
	chat, err := p.client.Chats.Create(ctx, geminiModel, config, history)
	if err != nil {
		return nil, fmt.Errorf("erro ao criar sessão de chat: %w", err)
	}

	// Enviar a mensagem atual do usuário
	resp, err := chat.SendMessage(ctx, genai.Part{Text: req.UserMessage})
	if err != nil {
		return nil, fmt.Errorf("erro ao chamar Gemini API: %w", err)
	}

	// Extrair texto da resposta
	if len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil {
		return nil, fmt.Errorf("resposta vazia da Gemini API")
	}

	var responseText strings.Builder
	for _, part := range resp.Candidates[0].Content.Parts {
		if part.Text != "" {
			responseText.WriteString(part.Text)
		}
	}

	return &ChatResponse{
		Content: responseText.String(),
	}, nil
}

// buildDocumentsContext formata os documentos da campanha como contexto para a IA.
func buildDocumentsContext(docs []DocumentContext) string {
	if len(docs) == 0 {
		return "(Nenhum documento encontrado nesta campanha ainda.)"
	}

	var sb strings.Builder
	for i, doc := range docs {
		sb.WriteString(fmt.Sprintf("---\n### [%d] %s\n\n%s\n\n", i+1, doc.Title, doc.Text))
	}
	return sb.String()
}

// buildHistory converte o histórico de mensagens para o formato da API Gemini.
func buildHistory(messages []Message) []*genai.Content {
	history := make([]*genai.Content, 0, len(messages))
	for _, msg := range messages {
		role := msg.Role
		// Gemini usa "model" em vez de "assistant"
		if role == "assistant" {
			role = "model"
		}
		history = append(history, genai.NewContentFromText(msg.Content, genai.Role(role)))
	}
	return history
}
