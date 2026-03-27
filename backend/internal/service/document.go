package service

import (
	"context"
	"errors"

	"github.com/CaioIOX/rpg-manager/backend/internal/customErrors"
	"github.com/CaioIOX/rpg-manager/backend/internal/dto"
	"github.com/CaioIOX/rpg-manager/backend/internal/model"
	"github.com/CaioIOX/rpg-manager/backend/internal/repository"
)

type DocumentService struct {
	documentRepo *repository.DocumentRepository
	campaignRepo *repository.CampaignRepository
}

func NewDocumentService(documentRepo *repository.DocumentRepository, campaignRepo *repository.CampaignRepository) *DocumentService {
	return &DocumentService{documentRepo: documentRepo, campaignRepo: campaignRepo}
}

func (s *DocumentService) GetByID(ctx context.Context, id, campaignID, loggedUser string) (*model.Document, error) {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return nil, errors.New("Ocorreu um erro ao recuperar o documento.")
	}

	if userRole != "owner" && userRole != "editor" && userRole != "viewer" {
		return nil, customErrors.ErrUnauthorized
	}

	document, err := s.documentRepo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.New("Erro ao recuperar documento.")
	}

	// Spoiler check: only creator or campaign owner can see spoiler docs
	if document.IsSpoiler && document.CreatedBy != loggedUser && userRole != "owner" {
		return nil, customErrors.ErrUnauthorized
	}

	return document, nil
}

func (s *DocumentService) GetByCampaign(ctx context.Context, campaignID, loggedUser string) ([]model.DocumentSummary, error) {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return nil, errors.New("Ocorreu um erro ao recuperar os documentos.")
	}

	if userRole != "owner" && userRole != "editor" && userRole != "viewer" {
		return nil, customErrors.ErrUnauthorized
	}

	documents, err := s.documentRepo.GetByCampaign(ctx, campaignID)
	if err != nil {
		return []model.DocumentSummary{}, errors.New("Erro ao buscar documentos.")
	}

	// Filter spoiler docs: only show to creator or campaign owner
	filtered := make([]model.DocumentSummary, 0, len(documents))
	for _, doc := range documents {
		if doc.IsSpoiler && doc.CreatedBy != loggedUser && userRole != "owner" {
			continue
		}
		filtered = append(filtered, doc)
	}

	return filtered, nil
}

func (s *DocumentService) GetByFolder(ctx context.Context, campaignID, folderID, loggedUser string) ([]model.DocumentSummary, error) {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return nil, errors.New("Ocorreu um erro ao recuperar os documentos.")
	}

	if userRole != "owner" && userRole != "editor" && userRole != "viewer" {
		return nil, customErrors.ErrUnauthorized
	}

	documents, err := s.documentRepo.GetByFolder(ctx, folderID)
	if err != nil {
		return []model.DocumentSummary{}, errors.New("Erro ao buscar documentos.")
	}

	// Filter spoiler docs
	filtered := make([]model.DocumentSummary, 0, len(documents))
	for _, doc := range documents {
		if doc.IsSpoiler && doc.CreatedBy != loggedUser && userRole != "owner" {
			continue
		}
		filtered = append(filtered, doc)
	}

	return filtered, nil
}

func (s *DocumentService) Create(ctx context.Context, newDocument dto.CreateDocumentRequest, campaignID, loggedUser string) error {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return errors.New("Ocorreu um erro ao recuperar os documentos.")
	}

	if userRole != "owner" && userRole != "editor" {
		return customErrors.ErrUnauthorized
	}

	isSpoiler := false
	if newDocument.IsSpoiler != nil {
		isSpoiler = *newDocument.IsSpoiler
	}

	document := &model.Document{
		Title:      newDocument.Title,
		FolderID:   newDocument.FolderID,
		TemplateID: newDocument.TemplateID,
		CampaignID: campaignID,
		CreatedBy:  loggedUser,
		Content:    newDocument.Content,
		IsSpoiler:  isSpoiler,
	}

	if err := s.documentRepo.Create(ctx, document); err != nil {
		return errors.New("Erro ao tentar criar o documento.")
	}

	return nil
}

func (s *DocumentService) Update(ctx context.Context, req dto.UpdateDocumentRequest, campaignID, documentID, loggedUser string) (*model.Document, error) {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return nil, errors.New("Ocorreu um erro ao atualizar o documento.")
	}

	if userRole != "owner" && userRole != "editor" {
		return nil, customErrors.ErrUnauthorized
	}

	updatedDocument, err := s.documentRepo.Update(ctx, documentID, req)
	if err != nil {
		return nil, errors.New("Erro ao atualizar documento.")
	}

	return updatedDocument, nil
}

func (s *DocumentService) Delete(ctx context.Context, documentID, campaignID, loggedUser string) error {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return errors.New("Ocorreu um erro ao apagar o documento.")
	}

	if userRole != "owner" && userRole != "editor" {
		return customErrors.ErrUnauthorized
	}

	if err := s.documentRepo.Delete(ctx, documentID); err != nil {
		return errors.New("Erro ao apagar o documento.")
	}

	return nil
}

func (s *DocumentService) GetLinksFrom(ctx context.Context, documentID, campaignID, loggedUser string) ([]model.DocumentLink, error) {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return nil, errors.New("Ocorreu um erro ao tentar recuperar as menções.")
	}

	if userRole != "owner" && userRole != "editor" && userRole != "viewer" {
		return nil, customErrors.ErrUnauthorized
	}

	documentLinks, err := s.documentRepo.GetLinksFrom(ctx, documentID)
	if err != nil {
		return []model.DocumentLink{}, errors.New("Erro ao buscar menções")
	}

	return documentLinks, nil
}

func (s *DocumentService) GetLinksTo(ctx context.Context, documentID, campaignID, loggedUser string) ([]model.DocumentLink, error) {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return nil, errors.New("Ocorreu um erro ao tentar recuperar as menções.")
	}

	if userRole != "owner" && userRole != "editor" && userRole != "viewer" {
		return nil, customErrors.ErrUnauthorized
	}

	documentLinks, err := s.documentRepo.GetLinksTo(ctx, documentID)
	if err != nil {
		return []model.DocumentLink{}, errors.New("Erro ao buscar menções")
	}

	return documentLinks, nil
}

func (s *DocumentService) CreateLink(ctx context.Context, req model.DocumentLink, campaignID, loggedUser string) error {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return errors.New("Ocorreu um erro ao tentar criar menção.")
	}

	if userRole != "owner" && userRole != "editor" {
		return customErrors.ErrUnauthorized
	}

	if err := s.documentRepo.CreateLink(ctx, &req); err != nil {
		return err
	}

	return nil
}

func (s *DocumentService) DeleteLinksFrom(ctx context.Context, campaignID, documentID, loggedUser string) error {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return errors.New("Ocorreu um erro ao tentar criar menção.")
	}

	if userRole != "owner" && userRole != "editor" {
		return customErrors.ErrUnauthorized
	}

	if err := s.documentRepo.DeleteLinksFrom(ctx, documentID); err != nil {
		return errors.New("Erro ao deletar menção.")
	}

	return nil
}

func (s *DocumentService) SearchByTitle(ctx context.Context, query, campaignID, loggedUser string) ([]model.DocumentSummary, error) {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return nil, errors.New("Ocorreu um erro ao buscar documentos.")
	}

	if userRole != "owner" && userRole != "editor" && userRole != "viewer" {
		return nil, customErrors.ErrUnauthorized
	}

	documents, err := s.documentRepo.SearchByTitle(ctx, campaignID, query)
	if err != nil {
		return []model.DocumentSummary{}, errors.New("Erro ao recuperar documentos.")
	}

	// Filter spoiler docs from search results
	filtered := make([]model.DocumentSummary, 0, len(documents))
	for _, doc := range documents {
		if doc.IsSpoiler && doc.CreatedBy != loggedUser && userRole != "owner" {
			continue
		}
		filtered = append(filtered, doc)
	}

	return filtered, nil
}

func (s *DocumentService) UpdateYjsState(ctx context.Context, state []byte, campaignID, documentID, loggedUser string) error {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return errors.New("Ocorreu um erro ao buscar documentos.")
	}

	if userRole != "owner" && userRole != "editor" {
		return customErrors.ErrUnauthorized
	}

	if err := s.documentRepo.UpdateYjsState(ctx, documentID, state); err != nil {
		return errors.New("Ocorreu um erro ao atualizar o documento.")
	}

	return nil
}
