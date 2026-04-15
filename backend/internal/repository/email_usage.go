package repository

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type EmailUsageRepository struct {
	db *pgxpool.Pool
}

func NewEmailUsageRepository(db *pgxpool.Pool) *EmailUsageRepository {
	return &EmailUsageRepository{db: db}
}

func (r *EmailUsageRepository) GetTodayCount(ctx context.Context, date time.Time) (int, error) {
	query := `SELECT count FROM daily_email_usage WHERE date = $1`
	var count int
	err := r.db.QueryRow(ctx, query, date.Format("2006-01-02")).Scan(&count)
	if errors.Is(err, pgx.ErrNoRows) {
		return 0, nil // No usage today
	}
	if err != nil {
		return 0, err
	}
	return count, nil
}

func (r *EmailUsageRepository) IncrementTodayCount(ctx context.Context, date time.Time) error {
	query := `
		INSERT INTO daily_email_usage (date, count) 
		VALUES ($1, 1) 
		ON CONFLICT (date) DO UPDATE SET count = daily_email_usage.count + 1
	`
	_, err := r.db.Exec(ctx, query, date.Format("2006-01-02"))
	return err
}
