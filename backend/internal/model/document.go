package model

import (
	"encoding/json"
	"time"
)

type Document struct {
	ID         string          `json:"id"`
	CampaignID string          `json:"campaign_id"`
	FolderID   *string         `json:"folder_id"`
	TemplateID *string         `json:"template_id"`
	Title      string          `json:"title"`
	Content    json.RawMessage `json:"content"`
	YjsState   []byte          `json:"-"`
	IsSpoiler  bool            `json:"is_spoiler"`
	CreatedBy  string          `json:"created_by"`
	CreatedAt  time.Time       `json:"created_at"`
	UpdatedAt  time.Time       `json:"updated_at"`
}

type DocumentLink struct {
	ID          string    `json:"id"`
	SourceDocID string    `json:"source_doc_id"`
	TargetDocID string    `json:"target_doc_id"`
	MentionText string    `json:"mention_text"`
	CreatedAt   time.Time `json:"created_at"`
}

type DocumentSummary struct {
	ID         string    `json:"id"`
	Title      string    `json:"title"`
	FolderID   *string   `json:"folder_id"`
	TemplateID *string   `json:"template_id"`
	IsSpoiler  bool      `json:"is_spoiler"`
	CreatedBy  string    `json:"created_by"`
	UpdatedAt  time.Time `json:"updated_at"`
}
