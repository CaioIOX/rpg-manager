package dto

import "github.com/CaioIOX/rpg-manager/backend/internal/model"

type CreateCampaignRequest struct {
	Name        string `json:"name" validate:"required,min=1,max=100"`
	Description string `json:"description" validate:"max=500"`
}

type UpdateCampaignRequest struct {
	Name        *string `json:"name" validate:"omitempty,min=1,max=100"`
	Description *string `json:"description" validate:"omitempty,max=500"`
}

type AddMemberRequest struct {
	Email string `json:"email" validate:"required,email"`
	Role  string `json:"role" validate:"required,oneof=editor viewer"`
}

type CampaignWithRole struct {
	model.Campaign
	Role string `json:"role"`
}
