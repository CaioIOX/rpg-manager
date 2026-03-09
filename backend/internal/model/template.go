package model

import (
	"encoding/json"
	"time"
)

type Template struct {
	ID             string          `json:"id"`
	CampaignID     string          `json:"campaign_id"`
	Name           string          `json:"name"`
	Description    string          `json:"description"`
	Icon           string          `json:"icon"`
	Schema         json.RawMessage `json:"schema"`
	DefaultContent json.RawMessage `json:"default_content"`
	CreatedAt      time.Time       `json:"created_at"`
	UpdatedAt      time.Time       `json:"updated_at"`
}

type TemplateField struct {
	Name     string   `json:"name"`
	Type     string   `json:"type"` // "text", "textarea", "select", "number"
	Label    string   `json:"label"`
	Required bool     `json:"required"`
	Options  []string `json:"options,omitempty"`
}


