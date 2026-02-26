package service

import (
	"context"
	"errors"

	"github.com/CaioIOX/rpg-manager/backend/internal/dto"
	"github.com/CaioIOX/rpg-manager/backend/internal/model"
	"github.com/CaioIOX/rpg-manager/backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	userRepo *repository.UserRepository
}

func NewAuthService(userRepo *repository.UserRepository) *AuthService {
	return &AuthService{userRepo: userRepo}
}

func (s *AuthService) Register(ctx context.Context, req dto.RegisterInput) error {
	existingEmail, _ := s.userRepo.GetByEmail(ctx, req.Email)
	if existingEmail != nil {
		return errors.New("Email já utilizado")
	}

	existingUsername, _ := s.userRepo.GetByUsername(ctx, req.Username)
	if existingUsername != nil {
		return errors.New("Username já utilizado")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user := &model.User{
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: string(hash),
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		return errors.New("Erro ao criar conta")
	}

	return nil
}
