package dto

import "encoding/json"

type CreateDocumentRequest struct {
	Title      string          `json:"title" validate:"required,min=1,max=200"`
	FolderID   *string         `json:"folder_id"`
	TemplateID *string         `json:"template_id"`
	Content    json.RawMessage `json:"content"`
	IsSpoiler  *bool           `json:"is_spoiler"`
	DocType    string          `json:"doc_type"`
}

type UpdateDocumentRequest struct {
	Title     *string         `json:"title" validate:"omitempty,min=1,max=200"`
	FolderID  *string         `json:"folder_id"`
	Content   json.RawMessage `json:"content"`
	IsSpoiler *bool           `json:"is_spoiler"`
}
