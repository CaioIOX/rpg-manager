package customErrors

import "errors"

var (
	ErrEmailAlreadyExists    = errors.New("email já utilizado")
	ErrUsernameAlreadyExists = errors.New("username já utilizado")
	ErrInvalidCredentials    = errors.New("credenciais inválidas")
	
	ErrUnauthorized          = errors.New("Usuário sem autorização!")
)
