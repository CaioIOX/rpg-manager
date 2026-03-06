package main

import (
	"context"
	"log"
	"os"

	"github.com/CaioIOX/rpg-manager/backend/internal/handler"
	"github.com/CaioIOX/rpg-manager/backend/internal/middleware"
	"github.com/CaioIOX/rpg-manager/backend/internal/repository"
	"github.com/CaioIOX/rpg-manager/backend/internal/service"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/pgx/v5"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	app := fiber.New()

	dbURL := os.Getenv("DATABASE_URL")

	db, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := db.Ping(context.Background()); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}
	log.Println("Connected to PostgreSQL")

	mURL := os.Getenv("MIGRATION_URL")

	m, err := migrate.New("file://migrations", mURL)
	if err != nil {
		log.Fatalf("Failed to create migrator: %v", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("Failed to run migrations: %v", err)
	}
	log.Println("Migrations applied")

	// Repositórios
	userRepo := repository.NewUserRepository(db)
	campaignRepo := repository.NewCampaignRepository(db)
	folderRepo := repository.NewFolderRepository(db)
	documentRepo := repository.NewDocumentRepository(db)

	// Services
	jwtSecret := os.Getenv("JWT_SECRET")
	authService := service.NewAuthService(userRepo, jwtSecret)
	campaignService := service.NewCampaignService(campaignRepo, userRepo)
	folderService := service.NewFolderService(folderRepo, campaignRepo)
	documentService := service.NewDocumentService(documentRepo, campaignRepo)

	// Handlers
	validate := validator.New()
	authHandler := handler.NewAuthHandler(authService, validate)
	campaignHandler := handler.NewCampaignHandler(campaignService, validate)
	folderHandler := handler.NewFolderHandler(folderService, validate)
	documentHandler := handler.NewDocumentHandler(documentService, validate)

	// Rotas autênticação
	auth := app.Group("/api/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)

	api := app.Group("/api", middleware.AuthRequired)
	// campanhas
	api.Get("/campaigns", campaignHandler.List)
	api.Get("/campaigns/:id", campaignHandler.Get)
	api.Post("/campaigns", campaignHandler.Create)
	api.Post("/campaigns/:id/members", campaignHandler.AddMember)
	api.Put("/campaigns/:id", campaignHandler.Update)
	api.Delete("/campaigns/:id", campaignHandler.Delete)

	// pastas
	api.Get("/campaigns/:campaign_id/folders", folderHandler.List)
	api.Get("/campaigns/:campaign_id/folders/:folder_id", folderHandler.Get)
	api.Post("/campaigns/:campaign_id/folders", folderHandler.Create)
	api.Put("/campaigns/:campaign_id/folders/:folder_id", folderHandler.Update)
	api.Delete("/campaigns/:campaign_id/folders/:folder_id", folderHandler.Delete)

	// Documentos
	api.Get("/campaigns/:campaign_id/documents", documentHandler.List)
	api.Get("/campaigns/:campaign_id/folders/:folder_id/documents/:document_id", documentHandler.Get)
	api.Post("/campaigns/:campaign_id/folders/:folder_id/documents", documentHandler.Create)
	api.Put("/campaigns/:campaign_id/folders/:folder_id/documents/:document_id", documentHandler.Update)
	api.Delete("/campaigns/:campaign_id/folders/:folder_id/documents/:document_id", documentHandler.Delete)
	api.Get("/campaigns/:campaign_id/documents/:document_id/search", documentHandler.Search)
	api.Get("/campaigns/:campaign_id/documents/links", documentHandler.GetLinks)

	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	app.Listen(":8080")
}
