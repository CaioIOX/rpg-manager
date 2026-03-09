package dto

import "encoding/json"

type CreateTemplateRequest struct {
	Name           string          `json:"name" validate:"required,min=1,max=100"`
	Description    string          `json:"description" validate:"max=300"`
	Icon           string          `json:"icon"`
	Schema         json.RawMessage `json:"schema" validate:"required"`
	DefaultContent json.RawMessage `json:"default_content"`
}

type UpdateTemplateRequest struct {
	Name           *string         `json:"name" validate:"omitempty,min=1,max=100"`
	Description    *string         `json:"description" validate:"max=300"`
	Icon           *string         `json:"icon"`
	Schema         json.RawMessage `json:"schema"`
	DefaultContent json.RawMessage `json:"default_content"`
}
