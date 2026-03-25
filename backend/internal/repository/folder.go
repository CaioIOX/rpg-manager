package repository

import (
	"context"

	"github.com/CaioIOX/rpg-manager/backend/internal/dto"
	"github.com/CaioIOX/rpg-manager/backend/internal/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

type FolderRepository struct {
	db *pgxpool.Pool
}

func NewFolderRepository(db *pgxpool.Pool) *FolderRepository {
	return &FolderRepository{db: db}
}

func (r *FolderRepository) Create(ctx context.Context, folder *model.Folder) error {
	query := `INSERT INTO folders (campaign_id, parent_id, name, position, color) Values ($1, $2, $3, $4, $5) RETURNING id, created_at, updated_at, color`
	return r.db.QueryRow(ctx, query, folder.CampaignID, folder.ParentID, folder.Name, folder.Position, folder.Color).Scan(&folder.ID, &folder.CreatedAt, &folder.UpdatedAt, &folder.Color)
}

func (r *FolderRepository) GetByCampaign(ctx context.Context, campaignID string) ([]model.Folder, error) {
	query := `SELECT id, campaign_id, parent_id, name, position, color, created_at, updated_at FROM folders WHERE campaign_id = $1 ORDER BY position`
	rows, err := r.db.Query(ctx, query, campaignID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var folders []model.Folder
	for rows.Next() {
		var f model.Folder
		err := rows.Scan(&f.ID, &f.CampaignID, &f.ParentID, &f.Name, &f.Position, &f.Color, &f.CreatedAt, &f.UpdatedAt)
		if err != nil {
			return nil, err
		}
		folders = append(folders, f)
	}

	return folders, rows.Err()
}

func (r *FolderRepository) GetByID(ctx context.Context, id string) (*model.Folder, error) {
	folder := &model.Folder{}
	query := `SELECT id, campaign_id, parent_id, name, position, color, created_at, updated_at FROM folders WHERE id = $1`

	err := r.db.QueryRow(ctx, query, id).Scan(&folder.ID, &folder.CampaignID, &folder.ParentID, &folder.Name, &folder.Position, &folder.Color, &folder.CreatedAt, &folder.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return folder, nil
}

func (r *FolderRepository) Update(ctx context.Context, id string, req dto.UpdateFolderRequest) (*model.Folder, error) {
	folder := &model.Folder{}
	query := `
		UPDATE folders 
		SET name = COALESCE($1, name), parent_id = COALESCE($2, parent_id), position = COALESCE($3, position), color = COALESCE($4, color), updated_at = NOW()
		WHERE id = $5
		RETURNING id, campaign_id, parent_id, name, position, color, created_at, updated_at`
	err := r.db.QueryRow(ctx, query, req.Name, req.ParentID, req.Position, req.Color, id).Scan(&folder.ID, &folder.CampaignID, &folder.ParentID, &folder.Name, &folder.Position, &folder.Color, &folder.CreatedAt, &folder.UpdatedAt)
	if err != nil {
		return nil, err
	}

	return folder, nil
}

func (r *FolderRepository) Delete(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM folders WHERE id = $1`, id)
	return err
}
