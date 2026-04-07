package service

import (
	"context"
	"errors"
	"log"

	"github.com/CaioIOX/rpg-manager/backend/internal/ai"
	"github.com/CaioIOX/rpg-manager/backend/internal/customErrors"
	"github.com/CaioIOX/rpg-manager/backend/internal/dto"
	"github.com/CaioIOX/rpg-manager/backend/internal/repository"
)

const (
	// FreeDailyLimit é o número máximo de mensagens diárias para usuários não-premium.
	FreeDailyLimit = 5
)

// ErrRateLimitExceeded é retornado quando o usuário atingiu o limite diário.
var ErrRateLimitExceeded = errors.New("limite diário de mensagens atingido")

// ChatService orquestra a lógica do chatbot Lorena:
// verifica permissões, rate limit, busca documentos, extrai texto e chama a IA.
type ChatService struct {
	chatRepo     *repository.ChatRepository
	documentRepo *repository.DocumentRepository
	campaignRepo *repository.CampaignRepository
	userRepo     *repository.UserRepository
	aiProvider   ai.Provider
}

func NewChatService(
	chatRepo *repository.ChatRepository,
	documentRepo *repository.DocumentRepository,
	campaignRepo *repository.CampaignRepository,
	userRepo *repository.UserRepository,
	aiProvider ai.Provider,
) *ChatService {
	return &ChatService{
		chatRepo:     chatRepo,
		documentRepo: documentRepo,
		campaignRepo: campaignRepo,
		userRepo:     userRepo,
		aiProvider:   aiProvider,
	}
}

// GetDailyUsage retorna quantas mensagens o usuário usou hoje e o limite correspondente.
func (s *ChatService) GetDailyUsage(ctx context.Context, userID string) (used int, limit int, err error) {
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return 0, 0, errors.New("erro ao recuperar dados do usuário")
	}

	if user.IsPremium {
		// Premium: sem limite
		count, err := s.chatRepo.GetDailyCount(ctx, userID)
		if err != nil {
			return 0, -1, nil
		}
		return count, -1, nil // -1 significa ilimitado
	}

	count, err := s.chatRepo.GetDailyCount(ctx, userID)
	if err != nil {
		return 0, FreeDailyLimit, nil
	}
	return count, FreeDailyLimit, nil
}

// Send processa uma mensagem do usuário e retorna a resposta da Lorena.
func (s *ChatService) Send(ctx context.Context, campaignID, loggedUser string, req dto.ChatRequest) (*dto.ChatResponse, error) {
	// 1. Verificar se o usuário é membro da campanha
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return nil, errors.New("erro ao verificar permissão na campanha")
	}
	if userRole != "owner" && userRole != "editor" && userRole != "viewer" {
		return nil, customErrors.ErrUnauthorized
	}

	// 2. Verificar rate limit
	user, err := s.userRepo.GetByID(ctx, loggedUser)
	if err != nil {
		return nil, errors.New("erro ao recuperar dados do usuário")
	}

	if !user.IsPremium {
		count, err := s.chatRepo.GetDailyCount(ctx, loggedUser)
		if err != nil {
			return nil, errors.New("erro ao verificar limite de mensagens")
		}
		if count >= FreeDailyLimit {
			return nil, ErrRateLimitExceeded
		}
	}

	// 3. Buscar todos os documentos da campanha que o usuário tem acesso
	summaries, err := s.documentRepo.GetByCampaign(ctx, campaignID)
	if err != nil {
		return nil, errors.New("erro ao carregar documentos da campanha")
	}

	// 4. Para cada documento, buscar o conteúdo e extrair o texto
	docs := make([]ai.DocumentContext, 0, len(summaries))
	for _, summary := range summaries {
		// Filtrar docs de spoiler que o usuário não pode ver
		if summary.IsSpoiler && summary.CreatedBy != loggedUser && userRole != "owner" {
			continue
		}

		fullDoc, err := s.documentRepo.GetByID(ctx, summary.ID)
		if err != nil {
			continue // pular documentos com erro
		}

		text := ExtractTextFromTipTap(fullDoc.Content)
		if text == "" {
			text = "(documento sem conteúdo)"
		}

		docs = append(docs, ai.DocumentContext{
			ID:    fullDoc.ID,
			Title: fullDoc.Title,
			Text:  text,
		})
	}

	// 5. Converter histórico do frontend para o formato do AI provider
	history := make([]ai.Message, 0, len(req.History))
	for _, h := range req.History {
		history = append(history, ai.Message{
			Role:    h.Role,
			Content: h.Content,
		})
	}

	// 6. Chamar o AI provider
	aiResp, err := s.aiProvider.Chat(ctx, ai.ChatRequest{
		UserMessage: req.Message,
		Documents:   docs,
		History:     history,
	})
	if err != nil {
		log.Printf("[CHAT] Erro chamando AI provider: %v", err)
		return nil, errors.New("Lorena está com dificuldades no momento. Tente novamente em breve.")
	}

	// 7. Incrementar contador de uso (mesmo para premium, para fins de analytics)
	_ = s.chatRepo.IncrementDailyCount(ctx, loggedUser)

	return &dto.ChatResponse{
		Content: aiResp.Content,
	}, nil
}
