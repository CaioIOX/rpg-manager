package dto

type UpdateMapRequest struct {
	Name *string `json:"name" validate:"omitempty,min=1,max=200"`
}

type CreateMarkerRequest struct {
	PosX       float64 `json:"pos_x" validate:"required"`
	PosY       float64 `json:"pos_y" validate:"required"`
	Label      *string `json:"label" validate:"omitempty,max=100"`
	DocumentID *string `json:"document_id" validate:"omitempty"`
}

type SyncMarkersRequest struct {
	Markers []CreateMarkerRequest `json:"markers" validate:"required"`
}
