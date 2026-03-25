package dto

// import "github.com/CaioIOX/rpg-manager/backend/internal/model"

type CreateFolderRequest struct {
	Name     string  `json:"name" validate:"required,min=1,max=100"`
	ParentID *string `json:"parent_id"`
	Color    *string `json:"color" validate:"omitempty,hexcolor"`
}

type UpdateFolderRequest struct {
	Name     *string `json:"name" validate:"omitempty,min=1,max=100"`
	ParentID *string `json:"parent_id"`
	Position *int    `json:"position"`
	Color    *string `json:"color" validate:"omitempty,hexcolor"`
}

// type FolderTree struct {
// 	model.Folder
// 	Children  []FolderTree `json:"children"`
// 	Documents []Document   `json:"documents"`
// }
