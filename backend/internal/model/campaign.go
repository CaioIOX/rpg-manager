package model

import "time"

type Campaign struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	OwnerId     string    `json:"owner_id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CampaignMember struct {
	CampaignID string    `json:"Campaign_id"`
	UserID     string    `json:"user_id"`
	Role       string    `json:"role"` // "owner", "editor", "viewer"
	JoinetAt   time.Time `json:"joined_at"`
}
