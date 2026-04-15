package email

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"log"
	"os"
	"strconv"
	"text/template"
	"time"

	"github.com/CaioIOX/rpg-manager/backend/internal/repository"
	"github.com/wneessen/go-mail"
)

var ErrEmailLimitReached = errors.New("EMAIL_DAILY_LIMIT_EXCEEDED")

type smtpService struct {
	usageRepo *repository.EmailUsageRepository
	limit     int
}

func NewSMTPService(usageRepo *repository.EmailUsageRepository) Service {
	limitStr := os.Getenv("DAILY_EMAIL_LIMIT")
	limit := 290
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil {
			limit = l
		}
	}
	return &smtpService{
		usageRepo: usageRepo,
		limit:     limit,
	}
}

func (s *smtpService) SendResetPasswordEmail(ctx context.Context, toEmail string, resetLink string) error {
	today := time.Now()
	
	count, err := s.usageRepo.GetTodayCount(ctx, today)
	if err != nil {
		log.Printf("Failed to get daily email count: %v", err)
		return err
	}

	if count >= s.limit {
		log.Printf("Email blocked: daily limit reached (%d/%d)", count, s.limit)
		return ErrEmailLimitReached
	}

	host := os.Getenv("SMTP_HOST")
	portStr := os.Getenv("SMTP_PORT")
	port, _ := strconv.Atoi(portStr)
	username := os.Getenv("SMTP_USER")
	password := os.Getenv("SMTP_PASSWORD")
	from := os.Getenv("SMTP_FROM")

	if host == "" || from == "" {
		return errors.New("SMTP configuration is missing")
	}

	m := mail.NewMsg()
	if err := m.From(from); err != nil {
		return err
	}
	if err := m.To(toEmail); err != nil {
		return err
	}
	m.Subject("Redefinição de Senha - CodexLore")

	tmplStr := `
	<!DOCTYPE html>
	<html>
	<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
		<div style="background-color: #ffffff; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
			<h2 style="color: #333333; text-align: center;">Redefinição de Senha</h2>
			<p style="color: #666666; line-height: 1.6;">Olá,</p>
			<p style="color: #666666; line-height: 1.6;">Recebemos um pedido para redefinir a senha da sua conta do CodexLore. Se você não fez esse pedido, pode ignorar este email de forma segura.</p>
			<div style="text-align: center; margin: 30px 0;">
				<a href="{{.ResetLink}}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Redefinir Minha Senha</a>
			</div>
			<p style="color: #666666; line-height: 1.6;">O link acima expira em 1 hora.</p>
			<p style="color: #999999; font-size: 12px; margin-top: 40px; text-align: center;">CodexLore - O seu multiverso organizado.</p>
		</div>
	</body>
	</html>
	`
	t, err := template.New("reset").Parse(tmplStr)
	if err != nil {
		return err
	}

	var body bytes.Buffer
	if err := t.Execute(&body, struct{ ResetLink string }{ResetLink: resetLink}); err != nil {
		return err
	}
	m.SetBodyString(mail.TypeTextHTML, body.String())

	client, err := mail.NewClient(host, mail.WithPort(port), mail.WithSMTPAuth(mail.SMTPAuthPlain), mail.WithUsername(username), mail.WithPassword(password))
	if err != nil {
		return fmt.Errorf("failed to create mail client: %w", err)
	}

	if err := client.DialAndSend(m); err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	if err := s.usageRepo.IncrementTodayCount(ctx, today); err != nil {
		log.Printf("Warning: failed to increment daily email count: %v", err)
	}

	return nil
}
