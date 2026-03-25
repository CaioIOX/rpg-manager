package model

import "time"

type Folder struct {
	ID         string    `json:"id"`
	CampaignID string    `json:"campaign_id"`
	ParentID   *string   `json:"parent_id"`
	Name       string    `json:"name"`
	Position   int       `json:"position"`
	Color      *string   `json:"color"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
