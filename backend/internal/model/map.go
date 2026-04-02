package model

import "time"

type Map struct {
	ID           string    `json:"id"`
	CampaignID   string    `json:"campaign_id"`
	Name         string    `json:"name"`
	FilePath     string    `json:"-"`
	FileSize     int64     `json:"file_size"`
	OriginalSize int64     `json:"original_size"`
	Width        int       `json:"width"`
	Height       int       `json:"height"`
	CreatedBy    string    `json:"created_by"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type MapSummary struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	FileSize  int64     `json:"file_size"`
	Width     int       `json:"width"`
	Height    int       `json:"height"`
	CreatedAt time.Time `json:"created_at"`
}

type MapMarker struct {
	ID         string    `json:"id"`
	MapID      string    `json:"map_id"`
	PosX       float64   `json:"pos_x"`
	PosY       float64   `json:"pos_y"`
	Label      *string   `json:"label"`
	DocumentID *string   `json:"document_id"`
	CreatedAt  time.Time `json:"created_at"`
}

type MapDetail struct {
	Map
	Markers []MapMarker `json:"markers"`
}
