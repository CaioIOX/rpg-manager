package service

import (
	"context"
	"errors"

	"github.com/CaioIOX/rpg-manager/backend/internal/customErrors"
	"github.com/CaioIOX/rpg-manager/backend/internal/dto"
	"github.com/CaioIOX/rpg-manager/backend/internal/model"
	"github.com/CaioIOX/rpg-manager/backend/internal/repository"
)

type CampaignService struct {
	campaignRepo *repository.CampaignRepository
	userRepo     *repository.UserRepository
}

func NewCampaignService(campaignRepo *repository.CampaignRepository, userRepo *repository.UserRepository) *CampaignService {
	return &CampaignService{campaignRepo: campaignRepo, userRepo: userRepo}
}

func (s *CampaignService) GetByID(ctx context.Context, id string, loggedUser string) (*dto.CampaignDetailsResponse, error) {
	hasPermission, err := s.campaignRepo.GetMemberRole(ctx, id, loggedUser)
	if err != nil {
		return nil, errors.New("Ocorreu um erro ao recuperar campanha.")
	}

	if hasPermission != "owner" && hasPermission != "editor" && hasPermission != "viewer" {
		return nil, customErrors.ErrUnauthorized
	}

	campaign, err := s.campaignRepo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.New("Erro ao recuperar campanha.")
	}
	members, err := s.campaignRepo.GetMembers(ctx, id)
	if err != nil {
		return nil, errors.New("Erro ao recuperar membros da campanha.")
	}

	response := &dto.CampaignDetailsResponse{
		Campaign: *campaign,
		Members:  members,
	}

	return response, err
}

func (s *CampaignService) GetByUser(ctx context.Context, loggedUser string) ([]dto.CampaignWithRole, error) {
	campaignList, err := s.campaignRepo.GetByUser(ctx, loggedUser)
	if err != nil {
		return []dto.CampaignWithRole{}, errors.New("Erro ao buscar campanhas.")
	}
	return campaignList, nil
}

func (s *CampaignService) Create(ctx context.Context, newCampaign dto.CreateCampaignRequest, loggedUser string) error {
	campaign := &model.Campaign{
		Name:        newCampaign.Name,
		Description: newCampaign.Description,
		OwnerId:     loggedUser,
	}

	if err := s.campaignRepo.Create(ctx, campaign); err != nil {
		return errors.New("Erro ao tentar criar campanha!")
	}

	if err := s.campaignRepo.AddMember(ctx, campaign.ID, loggedUser, "owner"); err != nil {
		return errors.New("Erro ao salvar membro!")
	}

	return nil
}

func (s *CampaignService) AddMember(ctx context.Context, dto dto.AddMemberRequest, id string, loggedUser string) error {
	hasPermission, err := s.campaignRepo.GetMemberRole(ctx, id, loggedUser)
	if err != nil {
		return errors.New("Ocorreu um erro ao adicionar novo membro!")
	}

	if hasPermission != "owner" {
		return customErrors.ErrUnauthorized
	}

	targetUser, err := s.userRepo.GetByEmail(ctx, dto.Email)
	if err != nil {
		return errors.New("Usuário não encontrado!")
	}

	if err := s.campaignRepo.AddMember(ctx, id, targetUser.ID, dto.Role); err != nil {
		return errors.New("Falha ao tentar adicionar novo membro a campanha!")
	}

	return nil

}

func (s *CampaignService) Update(ctx context.Context, id string, campaign dto.UpdateCampaignRequest, loggedUser string) (*model.Campaign, error) {
	hasPermission, err := s.campaignRepo.GetMemberRole(ctx, id, loggedUser)
	if err != nil {
		return nil, errors.New("Ocorreu um erro ao atualziar campanha.")
	}

	if hasPermission != "owner" {
		return nil, customErrors.ErrUnauthorized
	}

	updatedCampaign, err := s.campaignRepo.Update(ctx, id, campaign)
	if err != nil {
		return nil, errors.New("Erro ao atualizar campanha.")
	}

	return updatedCampaign, nil
}

func (s *CampaignService) Delete(ctx context.Context, id string, loggedUser string) error {
	hasPermission, err := s.campaignRepo.GetMemberRole(ctx, id, loggedUser)
	if err != nil {
		return errors.New("Ocorreu um erro ao deletar campanha.")
	}

	if hasPermission != "owner" {
		return customErrors.ErrUnauthorized
	}

	if err := s.campaignRepo.Delete(ctx, id); err != nil {
		return errors.New("Erro ao deletar campanha.")
	}

	return nil
}
