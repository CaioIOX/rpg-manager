package service

import (
	"context"
	"errors"
	"time"

	"github.com/CaioIOX/rpg-manager/backend/internal/customErrors"
	"github.com/CaioIOX/rpg-manager/backend/internal/dto"
	"github.com/CaioIOX/rpg-manager/backend/internal/model"
	"github.com/CaioIOX/rpg-manager/backend/internal/repository"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/api/idtoken"
	"os"
)

type AuthService struct {
	userRepo  *repository.UserRepository
	jwtSecret string
}

func NewAuthService(userRepo *repository.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{userRepo: userRepo, jwtSecret: jwtSecret}
}

func (s *AuthService) Register(ctx context.Context, req dto.RegisterInput) error {
	existingEmail, _ := s.userRepo.GetByEmail(ctx, req.Email)
	if existingEmail != nil {
		return customErrors.ErrEmailAlreadyExists
	}

	existingUsername, _ := s.userRepo.GetByUsername(ctx, req.Username)
	if existingUsername != nil {
		return customErrors.ErrUsernameAlreadyExists
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

func (s *AuthService) Login(ctx context.Context, req dto.LoginInput) (string, error) {
	user, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return "", customErrors.ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return "", customErrors.ErrInvalidCredentials
	}

	claims := jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return "", errors.New("Algo deu errado, por favor tente novamente!")
	}

	return signed, nil

}

func (s *AuthService) GetUser(ctx context.Context, id string) (*model.User, error) {
	return s.userRepo.GetByID(ctx, id)
}

func (s *AuthService) GoogleLogin(ctx context.Context, token string) (string, error) {
	clientID := os.Getenv("GOOGLE_CLIENT_ID")
	if clientID == "" {
		return "", errors.New("autenticação do Google não configurada no servidor")
	}

	payload, err := idtoken.Validate(ctx, token, clientID)
	if err != nil {
		return "", errors.New("token do Google inválido")
	}

	email, ok := payload.Claims["email"].(string)
	if !ok || email == "" {
		return "", errors.New("email do Google não encontrado")
	}

	name, _ := payload.Claims["name"].(string)
	if name == "" {
		name = "User"
	}

	user, err := s.userRepo.GetByEmail(ctx, email)
	if err != nil || user == nil {
		hash, _ := bcrypt.GenerateFromPassword([]byte("google_oauth_"+email), bcrypt.DefaultCost)
		user = &model.User{
			Username:     name,
			Email:        email,
			PasswordHash: string(hash),
		}
		if errCreate := s.userRepo.Create(ctx, user); errCreate != nil {
			return "", errors.New("erro ao criar usuário via Google")
		}
	}

	claims := jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := jwtToken.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return "", errors.New("algo deu errado, por favor tente novamente!")
	}

	return signed, nil
}
