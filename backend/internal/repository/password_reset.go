package repository

import (
	"context"
	"errors"

	"github.com/CaioIOX/rpg-manager/backend/internal/model"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PasswordResetRepository struct {
	db *pgxpool.Pool
}

func NewPasswordResetRepository(db *pgxpool.Pool) *PasswordResetRepository {
	return &PasswordResetRepository{db: db}
}

func (r *PasswordResetRepository) Create(ctx context.Context, pr *model.PasswordReset) error {
	query := `INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES ($1, $2, $3) RETURNING id, created_at`
	return r.db.QueryRow(ctx, query, pr.UserID, pr.TokenHash, pr.ExpiresAt).Scan(&pr.ID, &pr.CreatedAt)
}

func (r *PasswordResetRepository) GetByTokenHash(ctx context.Context, tokenHash string) (*model.PasswordReset, error) {
	pr := &model.PasswordReset{}
	query := `SELECT id, user_id, token_hash, expires_at, created_at FROM password_resets WHERE token_hash = $1`
	err := r.db.QueryRow(ctx, query, tokenHash).Scan(&pr.ID, &pr.UserID, &pr.TokenHash, &pr.ExpiresAt, &pr.CreatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil // Return nil if not found
	}
	if err != nil {
		return nil, err
	}
	return pr, nil
}

func (r *PasswordResetRepository) Delete(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM password_resets WHERE id = $1`, id)
	return err
}
