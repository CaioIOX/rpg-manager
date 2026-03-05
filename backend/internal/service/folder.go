package service

import (
	"context"
	"errors"

	"github.com/CaioIOX/rpg-manager/backend/internal/customErrors"
	"github.com/CaioIOX/rpg-manager/backend/internal/dto"
	"github.com/CaioIOX/rpg-manager/backend/internal/model"
	"github.com/CaioIOX/rpg-manager/backend/internal/repository"
)

type FolderService struct {
	folderRepo   *repository.FolderRepository
	campaignRepo *repository.CampaignRepository
}

func NewFolderService(folderRepo *repository.FolderRepository, campaignRepo *repository.CampaignRepository) *FolderService {
	return &FolderService{folderRepo: folderRepo, campaignRepo: campaignRepo}
}

func (s *FolderService) GetByID(ctx context.Context, campaignID string, id string, loggedUser string) (*model.Folder, error) {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return nil, errors.New("Ocorreu um erro ao recuperar pasta.")
	}
	if userRole != "owner" && userRole != "editor" && userRole != "viewer" {
		return nil, customErrors.ErrUnauthorized
	}

	folder, err := s.folderRepo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.New("Erro ao recuperar pasta.")
	}

	return folder, err
}

func (s *FolderService) GetByCampaign(ctx context.Context, campaignID string, loggedUser string) (*[]model.Folder, error) {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return nil, errors.New("Ocorreu um erro ao recuperar as pastas.")
	}
	if userRole != "owner" && userRole != "editor" && userRole != "viewer" {
		return nil, customErrors.ErrUnauthorized
	}

	folder, err := s.folderRepo.GetByCampaign(ctx, campaignID)
	if err != nil {
		return nil, errors.New("Erro ao recuperar pastas")
	}

	return &folder, nil
}

func (s *FolderService) Create(ctx context.Context, newFolder dto.CreateFolderRequest, campaignID string, loggedUser string) error {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return errors.New("Ocorreu um erro ao recuperar as pastas.")
	}
	if userRole != "owner" && userRole != "editor" {
		return customErrors.ErrUnauthorized
	}

	folder := &model.Folder{
		Name:       newFolder.Name,
		ParentID:   newFolder.ParentID,
		CampaignID: campaignID,
	}

	if err := s.folderRepo.Create(ctx, folder); err != nil {
		return errors.New("Erro ao tentar criar pasta.")
	}

	return nil
}

func (s *FolderService) Update(ctx context.Context, id string, campaignID string, folder dto.UpdateFolderRequest, loggedUser string) (*model.Folder, error) {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return nil, errors.New("Ocorreu um erro ao atualizar a pasta.")
	}
	if userRole != "owner" && userRole != "editor" {
		return nil, customErrors.ErrUnauthorized
	}

	updatedFolder, err := s.folderRepo.Update(ctx, id, folder)
	if err != nil {
		return nil, errors.New("Erro ao atualizar pasta.")
	}

	return updatedFolder, nil
}

func (s *FolderService) Delete(ctx context.Context, id string, campaignID string, loggedUser string) error {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return errors.New("Ocorreu um erro ao atualizar a pasta.")
	}
	if userRole != "owner" && userRole != "editor" {
		return customErrors.ErrUnauthorized
	}

	if err := s.folderRepo.Delete(ctx, id); err != nil {
		return errors.New("Erro ao deletar pasta.")
	}

	return nil
}
