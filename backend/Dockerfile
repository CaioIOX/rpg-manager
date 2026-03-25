FROM golang:1.24-alpine AS builder

WORKDIR /app

# Instalar dependências necessárias para a build
RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build do binário com otimizações de tamanho
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o main ./cmd/server

FROM alpine:latest
WORKDIR /app

# Copiar binário e migrações do builder
COPY --from=builder /app/main .
COPY --from=builder /app/migrations ./migrations

EXPOSE 8080

CMD ["./main"] 
