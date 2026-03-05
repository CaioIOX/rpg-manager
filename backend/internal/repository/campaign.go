package repository

import (
	"context"

	"github.com/CaioIOX/rpg-manager/backend/internal/dto"
	"github.com/CaioIOX/rpg-manager/backend/internal/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CampaignRepository struct {
	db *pgxpool.Pool
}

func NewCampaignRepository(db *pgxpool.Pool) *CampaignRepository {
	return &CampaignRepository{db: db}
}

func (r *CampaignRepository) Create(ctx context.Context, campaign *model.Campaign) error {
	query := `INSERT INTO campaigns (name, description, owner_id) VALUES ($1, $2, $3) RETURNING id, created_at, updated_at`
	return r.db.QueryRow(ctx, query, campaign.Name, campaign.Description, campaign.OwnerId).Scan(&campaign.ID, &campaign.CreatedAt, &campaign.UpdatedAt)
}

func (r *CampaignRepository) GetByID(ctx context.Context, id string) (*model.Campaign, error) {
	campaign := &model.Campaign{}

	query := `SELECT id, name, description, owner_id, created_at, updated_at FROM campaigns WHERE id = $1`

	err := r.db.QueryRow(ctx, query, id).Scan(&campaign.ID, &campaign.Name, &campaign.Description, &campaign.OwnerId, &campaign.CreatedAt, &campaign.UpdatedAt)

	if err != nil {
		return nil, err
	}

	return campaign, nil
}

func (r *CampaignRepository) GetByUser(ctx context.Context, userID string) ([]dto.CampaignWithRole, error) {
	query := `
		SELECT c.id, c.name, c.description, c.owner_id, c.created_at, c.updated_at, cm.role
		FROM campaigns c
		JOIN campaign_members cm ON c.id = cm.campaign_id
		WHERE cm.user_id = $1
		ORDER BY c.updated_at DESC`

	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	campaigns := make([]dto.CampaignWithRole, 0)

	for rows.Next() {
		var c dto.CampaignWithRole
		err := rows.Scan(&c.ID, &c.Name, &c.Description, &c.OwnerId, &c.CreatedAt, &c.UpdatedAt, &c.Role)
		if err != nil {
			return nil, err
		}

		campaigns = append(campaigns, c)
	}

	return campaigns, rows.Err()
}

func (r *CampaignRepository) GetMembers(ctx context.Context, campaignID string) ([]dto.MemberResponse, error) {
	query := `
	SELECT u.id, u.username, u.email, cm.role 
	FROM users u 
	JOIN campaign_members cm ON u.id = cm.user_id 
	WHERE cm.campaign_id = $1`

	rows, err := r.db.Query(ctx, query, campaignID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	members := make([]dto.MemberResponse, 0)

	for rows.Next() {
		var m dto.MemberResponse
		err := rows.Scan(&m.ID, &m.Username, &m.Email, &m.Role)
		if err != nil {
			return nil, err
		}

		members = append(members, m)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return members, nil
}

func (r *CampaignRepository) Update(ctx context.Context, id string, req dto.UpdateCampaignRequest) (*model.Campaign, error) {
	campaign := &model.Campaign{}

	query := `UPDATE campaigns 
	SET name = COALESCE($1, name), description = COALESCE($2, description), updated_at = NOW() 
	WHERE id = $3 
	RETURNING id, name, description, owner_id, created_at, updated_at`

	err := r.db.QueryRow(ctx, query, req.Name, req.Description, id).Scan(&campaign.ID, &campaign.Name, &campaign.Description, &campaign.OwnerId, &campaign.CreatedAt, &campaign.UpdtaedAt)
	if err != nil {
		return nil, err
	}
	return campaign, nil
}

func (r *CampaignRepository) Delete(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM campaigns WHERE id = $1`, id)
	return err
}

func (r *CampaignRepository) AddMember(ctx context.Context, campaignID, userID, role string) error {
	query := `INSERT INTO campaign_members (campaign_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT (campaign_id, user_id) DO UPDATE SET role =$3`
	_, err := r.db.Exec(ctx, query, campaignID, userID, role)

	return err
}

func (r *CampaignRepository) GetMemberRole(ctx context.Context, campaignID, userID string) (string, error) {
	var role string
	query := `SELECT role FROM campaign_members WHERE campaign_id = $1 AND user_id = $2`

	err := r.db.QueryRow(ctx, query, campaignID, userID).Scan(&role)

	if err != nil {
		return "", err
	}

	return role, nil
}

func (r *CampaignRepository) RemoveMember(ctx context.Context, campaignID, userID string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM campaign_members WHERE campaign_id = $1 AND user_id = $2`, campaignID, userID)

	return err
}
