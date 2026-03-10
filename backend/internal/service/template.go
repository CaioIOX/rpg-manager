package service

import (
	"context"
	"errors"

	"github.com/CaioIOX/rpg-manager/backend/internal/customErrors"
	"github.com/CaioIOX/rpg-manager/backend/internal/dto"
	"github.com/CaioIOX/rpg-manager/backend/internal/model"
	"github.com/CaioIOX/rpg-manager/backend/internal/repository"
)

type TemplateService struct {
	templateRepo *repository.TemplateRepository
	campaignRepo *repository.CampaignRepository
}

func NewTemplateService(templateRepo *repository.TemplateRepository, campaignRepo *repository.CampaignRepository) *TemplateService {
	return &TemplateService{templateRepo: templateRepo, campaignRepo: campaignRepo}
}

func (s *TemplateService) Create(ctx context.Context, newTmpl dto.CreateTemplateRequest, campaignID, loggedUser string) error {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return errors.New("Ocorreu um erro ao criar o template.")
	}

	if userRole != "owner" && userRole != "editor" {
		return customErrors.ErrUnauthorized
	}

	template := &model.Template{
		Name:           newTmpl.Name,
		CampaignID:     campaignID,
		Description:    newTmpl.Description,
		Icon:           newTmpl.Icon,
		Schema:         newTmpl.Schema,
		DefaultContent: newTmpl.DefaultContent,
	}

	if err := s.templateRepo.Create(ctx, template); err != nil {
		return errors.New("Erro ao tentar criat template.")
	}

	return nil
}

func (s *TemplateService) GetByID(ctx context.Context, id, campaignID, loggedUser string) (*model.Template, error) {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return nil, errors.New("Ocorreu um erro ao recuperar o template.")
	}

	if userRole != "owner" && userRole != "editor" && userRole != "viewer" {
		return nil, customErrors.ErrUnauthorized
	}

	template, err := s.templateRepo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.New("Erro ao recuperar template.")
	}

	return template, err
}

func (s *TemplateService) GetByCampaign(ctx context.Context, campaignID, loggedUser string) ([]model.Template, error) {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return nil, errors.New("Ocorreu um erro ao recuperar o template.")
	}

	if userRole != "owner" && userRole != "editor" && userRole != "viewer" {
		return nil, customErrors.ErrUnauthorized
	}

	template, err := s.templateRepo.GetByCampaign(ctx, campaignID)
	if err != nil {
		return []model.Template{}, errors.New("Erro ao buscar templates.")
	}

	return template, nil
}

func (s *TemplateService) Update(ctx context.Context, req dto.UpdateTemplateRequest, templateId, campaignID, loggedUser string) (*model.Template, error) {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return nil, errors.New("Ocorreu um erro ao recuperar o template.")
	}

	if userRole != "owner" && userRole != "editor" {
		return nil, customErrors.ErrUnauthorized
	}

	updatedTemplate, err := s.templateRepo.Update(ctx, templateId, req)
	if err != nil {
		return nil, errors.New("Erro ao atualziar template.")
	}

	return updatedTemplate, nil
}

func (s *TemplateService) Delete(ctx context.Context, templateID, campaignID, loggedUser string) error {
	userRole, err := s.campaignRepo.GetMemberRole(ctx, campaignID, loggedUser)
	if err != nil {
		return errors.New("Ocorreu um erro ao recuperar o template.")
	}

	if userRole != "owner" && userRole != "editor" {
		return customErrors.ErrUnauthorized
	}

	if err := s.templateRepo.Delete(ctx, templateID); err != nil {
		return errors.New("Erro ao apagar template.")
	}

	return nil
}
