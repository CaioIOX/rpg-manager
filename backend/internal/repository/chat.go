package repository

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

// ChatRepository gerencia o rate limiting diário do chatbot Lorena.
type ChatRepository struct {
	db *pgxpool.Pool
}

func NewChatRepository(db *pgxpool.Pool) *ChatRepository {
	return &ChatRepository{db: db}
}

// GetDailyCount retorna quantas mensagens o usuário enviou hoje.
func (r *ChatRepository) GetDailyCount(ctx context.Context, userID string) (int, error) {
	today := time.Now().UTC().Format("2006-01-02")
	var count int
	err := r.db.QueryRow(ctx,
		`SELECT message_count FROM chat_rate_limits WHERE user_id = $1 AND date = $2`,
		userID, today,
	).Scan(&count)

	if err != nil {
		// Row não encontrada = zero mensagens hoje
		return 0, nil
	}
	return count, nil
}

// IncrementDailyCount incrementa (ou cria) o contador de mensagens do dia para o usuário.
func (r *ChatRepository) IncrementDailyCount(ctx context.Context, userID string) error {
	today := time.Now().UTC().Format("2006-01-02")
	_, err := r.db.Exec(ctx,
		`INSERT INTO chat_rate_limits (user_id, date, message_count)
         VALUES ($1, $2, 1)
         ON CONFLICT (user_id, date) DO UPDATE
         SET message_count = chat_rate_limits.message_count + 1`,
		userID, today,
	)
	return err
}
