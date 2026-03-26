package repository

import (
	"context"
	"log"

	"github.com/CaioIOX/rpg-manager/backend/internal/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(ctx context.Context, user *model.User) error {
	query := `INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, created_at, updated_at`
	return r.db.QueryRow(ctx, query, user.Username, user.Email, user.PasswordHash).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*model.User, error) {
	user := &model.User{}

	query := `SELECT id, username, email, password_hash, created_at, updated_at FROM users WHERE email = $1`
	err := r.db.QueryRow(ctx, query, email).Scan(&user.ID, &user.Username, &user.Email, &user.PasswordHash, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		log.Printf("[DB ERROR] GetByEmail failed for %s: %v", email, err)
		return nil, err
	}

	return user, nil
}

func (r *UserRepository) GetByUsername(ctx context.Context, username string) (*model.User, error) {
	user := &model.User{}

	query := `SELECT id, username, email, password_hash, created_at, updated_at FROM users WHERE username = $1`
	err := r.db.QueryRow(ctx, query, username).Scan(&user.ID, &user.Username, &user.Email, &user.PasswordHash, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (r *UserRepository) GetByID(ctx context.Context, id string) (*model.User, error) {
	user := &model.User{}
	
	query := `SELECT id, username, email, password_hash, created_at, updated_at FROM users WHERE id = $1`
	err := r.db.QueryRow(ctx, query, id).
		Scan(&user.ID, &user.Username, &user.Email, &user.PasswordHash, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return user, nil
}
