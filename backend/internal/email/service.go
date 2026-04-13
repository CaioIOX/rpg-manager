package email

import "context"

type Service interface {
	SendResetPasswordEmail(ctx context.Context, toEmail string, resetLink string) error
}
