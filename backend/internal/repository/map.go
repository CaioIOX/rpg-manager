package repository

import (
	"context"

	"github.com/CaioIOX/rpg-manager/backend/internal/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

type MapRepository struct {
	db *pgxpool.Pool
}

func NewMapRepository(db *pgxpool.Pool) *MapRepository {
	return &MapRepository{db: db}
}

func (r *MapRepository) Create(ctx context.Context, m *model.Map) error {
	query := `INSERT INTO maps (campaign_id, name, file_path, file_size, original_size, width, height, created_by)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at, updated_at`
	return r.db.QueryRow(ctx, query,
		m.CampaignID, m.Name, m.FilePath, m.FileSize, m.OriginalSize, m.Width, m.Height, m.CreatedBy,
	).Scan(&m.ID, &m.CreatedAt, &m.UpdatedAt)
}

func (r *MapRepository) GetByID(ctx context.Context, id string) (*model.Map, error) {
	m := &model.Map{}
	query := `SELECT id, campaign_id, name, file_path, file_size, original_size, width, height, created_by, created_at, updated_at
		FROM maps WHERE id = $1`
	err := r.db.QueryRow(ctx, query, id).Scan(
		&m.ID, &m.CampaignID, &m.Name, &m.FilePath, &m.FileSize, &m.OriginalSize,
		&m.Width, &m.Height, &m.CreatedBy, &m.CreatedAt, &m.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return m, nil
}

func (r *MapRepository) GetByCampaign(ctx context.Context, campaignID string) ([]model.MapSummary, error) {
	query := `SELECT id, name, file_size, width, height, created_at
		FROM maps WHERE campaign_id = $1 ORDER BY created_at DESC`
	rows, err := r.db.Query(ctx, query, campaignID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	maps := make([]model.MapSummary, 0)
	for rows.Next() {
		var m model.MapSummary
		if err := rows.Scan(&m.ID, &m.Name, &m.FileSize, &m.Width, &m.Height, &m.CreatedAt); err != nil {
			return nil, err
		}
		maps = append(maps, m)
	}
	return maps, rows.Err()
}

func (r *MapRepository) Update(ctx context.Context, id, name string) (*model.Map, error) {
	m := &model.Map{}
	query := `UPDATE maps SET name = $1, updated_at = NOW() WHERE id = $2
		RETURNING id, campaign_id, name, file_path, file_size, original_size, width, height, created_by, created_at, updated_at`
	err := r.db.QueryRow(ctx, query, name, id).Scan(
		&m.ID, &m.CampaignID, &m.Name, &m.FilePath, &m.FileSize, &m.OriginalSize,
		&m.Width, &m.Height, &m.CreatedBy, &m.CreatedAt, &m.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return m, nil
}

func (r *MapRepository) Delete(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM maps WHERE id = $1`, id)
	return err
}

// ---- Markers ----

func (r *MapRepository) GetMarkersByMap(ctx context.Context, mapID string) ([]model.MapMarker, error) {
	query := `SELECT id, map_id, pos_x, pos_y, label, document_id, created_at
		FROM map_markers WHERE map_id = $1 ORDER BY created_at`
	rows, err := r.db.Query(ctx, query, mapID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	markers := make([]model.MapMarker, 0)
	for rows.Next() {
		var m model.MapMarker
		if err := rows.Scan(&m.ID, &m.MapID, &m.PosX, &m.PosY, &m.Label, &m.DocumentID, &m.CreatedAt); err != nil {
			return nil, err
		}
		markers = append(markers, m)
	}
	return markers, rows.Err()
}

func (r *MapRepository) SyncMarkers(ctx context.Context, mapID string, markers []model.MapMarker) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	if _, err = tx.Exec(ctx, `DELETE FROM map_markers WHERE map_id = $1`, mapID); err != nil {
		return err
	}

	for _, m := range markers {
		_, err = tx.Exec(ctx,
			`INSERT INTO map_markers (map_id, pos_x, pos_y, label, document_id) VALUES ($1, $2, $3, $4, $5)`,
			mapID, m.PosX, m.PosY, m.Label, m.DocumentID,
		)
		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}
