package service

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"time"

	"github.com/CaioIOX/rpg-manager/backend/internal/customErrors"
	"github.com/CaioIOX/rpg-manager/backend/internal/dto"
	"github.com/CaioIOX/rpg-manager/backend/internal/email"
	"github.com/CaioIOX/rpg-manager/backend/internal/model"
	"github.com/CaioIOX/rpg-manager/backend/internal/repository"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"google.golang.org/api/idtoken"
	"log"
	"os"
)

func generateRandomToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func hashToken(token string) string {
	h := sha256.New()
	h.Write([]byte(token))
	return hex.EncodeToString(h.Sum(nil))
}

type AuthService struct {
	userRepo     *repository.UserRepository
	prRepo       *repository.PasswordResetRepository
	emailService email.Service
	jwtSecret    string
}

func NewAuthService(userRepo *repository.UserRepository, prRepo *repository.PasswordResetRepository, emailService email.Service, jwtSecret string) *AuthService {
	return &AuthService{userRepo: userRepo, prRepo: prRepo, emailService: emailService, jwtSecret: jwtSecret}
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
		log.Printf("[LOGIN ERROR] GetByEmail failed for %s: %v", req.Email, err)
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
		log.Printf("[GOOGLE AUTH ERROR] Validation failed: %v", err)
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
		log.Printf("[GOOGLE AUTH] User %s not found, creating new account", email)
		hash, _ := bcrypt.GenerateFromPassword([]byte("google_oauth_"+email), bcrypt.DefaultCost)
		user = &model.User{
			Username:     name,
			Email:        email,
			PasswordHash: string(hash),
		}
		if errCreate := s.userRepo.Create(ctx, user); errCreate != nil {
			log.Printf("[GOOGLE AUTH ERROR] Failed to create user %s: %v", email, errCreate)
			return "", errors.New("erro ao criar usuário via Google")
		}
		// Refresh user to get the full model (ID, etc) if Scan didn't populate it
		user, err = s.userRepo.GetByEmail(ctx, email)
		if err != nil || user == nil {
			log.Printf("[GOOGLE AUTH ERROR] Still could not find user %s after creation: %v", email, err)
			return "", errors.New("erro crítico ao recuperar usuário após criação")
		}
	}

	claims := jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}

	jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := jwtToken.SignedString([]byte(s.jwtSecret))
	if err != nil {
		log.Printf("[GOOGLE AUTH ERROR] JWT signing failed: %v", err)
		return "", errors.New("algo deu errado, por favor tente novamente!")
	}

	return signed, nil
}

func (s *AuthService) ForgotPassword(ctx context.Context, req dto.ForgotPasswordInput) error {
	user, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil || user == nil {
		return nil // Silent fail if user does not exist
	}

	token, err := generateRandomToken()
	if err != nil {
		return err
	}

	tokenHash := hashToken(token)

	pr := &model.PasswordReset{
		UserID:    user.ID,
		TokenHash: tokenHash,
		ExpiresAt: time.Now().Add(1 * time.Hour),
	}

	if err := s.prRepo.Create(ctx, pr); err != nil {
		return err
	}

	frontendUrl := os.Getenv("FRONTEND_URL")
	if frontendUrl == "" {
		frontendUrl = "http://localhost:3000"
	}
	resetLink := fmt.Sprintf("%s/auth/reset-password?token=%s", frontendUrl, token)

	err = s.emailService.SendResetPasswordEmail(ctx, user.Email, resetLink)
	if err != nil {
		if errors.Is(err, email.ErrEmailLimitReached) {
			return err
		}
		log.Printf("Failed to send reset email: %v", err)
	}

	return nil
}

func (s *AuthService) ResetPassword(ctx context.Context, req dto.ResetPasswordInput) error {
	tokenHash := hashToken(req.Token)

	pr, err := s.prRepo.GetByTokenHash(ctx, tokenHash)
	if err != nil {
		return err
	}
	if pr == nil {
		return errors.New("token inválido ou expirado")
	}

	if time.Now().After(pr.ExpiresAt) {
		_ = s.prRepo.Delete(ctx, pr.ID)
		return errors.New("token expirado")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	if err := s.userRepo.UpdatePassword(ctx, pr.UserID, string(hash)); err != nil {
		return err
	}

	_ = s.prRepo.Delete(ctx, pr.ID)

	return nil
}
