package main

import (
	"context"
	"log"
	"os"

	"github.com/CaioIOX/rpg-manager/backend/internal/handler"
	"github.com/CaioIOX/rpg-manager/backend/internal/middleware"
	"github.com/CaioIOX/rpg-manager/backend/internal/repository"
	"github.com/CaioIOX/rpg-manager/backend/internal/service"
	"github.com/CaioIOX/rpg-manager/backend/internal/ws"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/websocket/v2"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load() // Local .env
	godotenv.Load("../../.env") // Try root .env if running from cmd/server

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		// Fallback para desenvolvimento local caso DATABASE_URL não esteja definida
		dbPass := os.Getenv("DB_PASSWORD")
		if dbPass == "" {
			dbPass = "rpg123" // Default do docker-compose.yml
		}
		dbURL = "postgres://rpg:" + dbPass + "@localhost:5432/rpg_manager?sslmode=disable"
		log.Printf("DATABASE_URL not set, using local default: %s", dbURL)
	}

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
	if mURL == "" {
		mURL = dbURL
	}

	m, err := migrate.New("file://migrations", mURL)
	if err != nil {
		log.Fatalf("Failed to create migrator: %v", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("Failed to run migrations: %v", err)
	}
	log.Println("Migrations applied")

	hub := ws.NewHub()
	// Repositórios
	userRepo := repository.NewUserRepository(db)
	campaignRepo := repository.NewCampaignRepository(db)
	folderRepo := repository.NewFolderRepository(db)
	documentRepo := repository.NewDocumentRepository(db)
	templatesRepo := repository.NewTemplateRepository(db)

	// Services
	jwtSecret := os.Getenv("JWT_SECRET")
	authService := service.NewAuthService(userRepo, jwtSecret)
	campaignService := service.NewCampaignService(campaignRepo, userRepo)
	folderService := service.NewFolderService(folderRepo, campaignRepo)
	documentService := service.NewDocumentService(documentRepo, campaignRepo)
	templateService := service.NewTemplateService(templatesRepo, campaignRepo)

	// Handlers
	validate := validator.New()
	authHandler := handler.NewAuthHandler(authService, validate)
	campaignHandler := handler.NewCampaignHandler(campaignService, validate)
	folderHandler := handler.NewFolderHandler(folderService, validate)
	documentHandler := handler.NewDocumentHandler(documentService, validate)
	templateHandler := handler.NewTemplateHandler(templateService, validate)
	wsH := ws.NewHandler(documentRepo)

	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	if allowedOrigins == "" {
		allowedOrigins = "http://localhost:3000"
	}

	app.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     "GET, POST, HEAD, PUT, DELETE",
		AllowHeaders:     "Origin, Content-Type, Accept",
		AllowCredentials: true,
	}))

	// Rotas autênticação
	auth := app.Group("/api/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)
	auth.Post("/google", authHandler.GoogleLogin)

	api := app.Group("/api", middleware.AuthRequired)

	api.Get("/me", authHandler.Me)
	api.Post("/logout", authHandler.Logout)
	// campanhas
	api.Get("/campaigns", campaignHandler.List)
	api.Get("/campaigns/:campaign_id", campaignHandler.Get)
	api.Post("/campaigns", campaignHandler.Create)
	api.Post("/campaigns/:campaign_id/members", campaignHandler.AddMember)
	api.Put("/campaigns/:campaign_id", campaignHandler.Update)
	api.Delete("/campaigns/:campaign_id", campaignHandler.Delete)

	// pastas
	api.Get("/campaigns/:campaign_id/folders", folderHandler.List)
	api.Get("/campaigns/:campaign_id/folders/:folder_id", folderHandler.Get)
	api.Post("/campaigns/:campaign_id/folders", folderHandler.Create)
	api.Put("/campaigns/:campaign_id/folders/:folder_id", folderHandler.Update)
	api.Delete("/campaigns/:campaign_id/folders/:folder_id", folderHandler.Delete)

	// Documentos
	api.Get("/campaigns/:campaign_id/documents", documentHandler.List)
	api.Get("/campaigns/:campaign_id/documents/:document_id", documentHandler.Get)
	api.Post("/campaigns/:campaign_id/documents", documentHandler.Create)
	api.Put("/campaigns/:campaign_id/documents/:document_id", documentHandler.Update)
	api.Delete("/campaigns/:campaign_id/documents/:document_id", documentHandler.Delete)
	api.Get("/campaigns/:campaign_id/search", documentHandler.Search)
	api.Get("/campaigns/:campaign_id/documents/:document_id/links", documentHandler.GetLinks)
	api.Post("/campaigns/:campaign_id/documents/:document_id/links", documentHandler.SyncLinks)

	// Templates
	api.Get("/campaigns/:campaign_id/templates", templateHandler.List)
	api.Get("/campaigns/:campaign_id/templates/:template_id", templateHandler.Get)
	api.Post("/campaigns/:campaign_id/templates", templateHandler.Create)
	api.Put("/campaigns/:campaign_id/templates/:template_id", templateHandler.Update)
	api.Delete("/campaigns/:campaign_id/templates/:template_id", templateHandler.Delete)

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	// Websocket
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}

		return fiber.ErrUpgradeRequired
	})

	app.Get("/ws/doc/:doc_id", middleware.AuthRequired, wsH.HandlerWs(hub))

	app.Listen(":8080")
}
