package service

import (
	"context"
	"errors"
	"fmt"
	"image"
	_ "image/gif"
	"image/jpeg"
	_ "image/png"
	"io"
	"os"
	"path/filepath"

	"github.com/CaioIOX/rpg-manager/backend/internal/customErrors"
	"github.com/CaioIOX/rpg-manager/backend/internal/dto"
	"github.com/CaioIOX/rpg-manager/backend/internal/model"
	"github.com/CaioIOX/rpg-manager/backend/internal/repository"
	"github.com/google/uuid"
)

const (
	MaxFileSizeFree    = 25 * 1024 * 1024 // 25MB per file for free users
	MaxFileSizePremium = 50 * 1024 * 1024 // 50MB per file for premium users
	MaxStorageFree     = 25 * 1024 * 1024 // 25MB total storage for free users
	UploadsDir         = "./uploads/maps"
	JpegCompressQuality = 80
)

type MapService struct {
	mapRepo      *repository.MapRepository
	campaignRepo *repository.CampaignRepository
	userRepo     *repository.UserRepository
}

func NewMapService(
	mapRepo *repository.MapRepository,
	campaignRepo *repository.CampaignRepository,
	userRepo *repository.UserRepository,
) *MapService {
	return &MapService{
		mapRepo:      mapRepo,
		campaignRepo: campaignRepo,
		userRepo:     userRepo,
	}
}

func (s *MapService) checkMember(ctx context.Context, campaignID, userID string, requiredRoles ...string) (string, error) {
	role, err := s.campaignRepo.GetMemberRole(ctx, campaignID, userID)
	if err != nil {
		return "", errors.New("Erro ao verificar permissão.")
	}
	for _, r := range requiredRoles {
		if role == r {
			return role, nil
		}
	}
	return "", customErrors.ErrUnauthorized
}

func (s *MapService) Upload(ctx context.Context, campaignID, userID, name string, fileReader io.Reader, originalSize int64) (*model.Map, error) {
	if _, err := s.checkMember(ctx, campaignID, userID, "owner", "editor"); err != nil {
		return nil, err
	}

	// Get user to apply per-tier limits
	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, errors.New("Erro ao verificar limites de armazenamento.")
	}

	// Per-tier file size limit
	maxFileSize := int64(MaxFileSizeFree)
	if user.IsPremium {
		maxFileSize = int64(MaxFileSizePremium)
	}

	if originalSize > maxFileSize {
		if user.IsPremium {
			return nil, errors.New("Arquivo excede o limite de 50MB.")
		}
		return nil, errors.New("Arquivo excede o limite de 25MB. Usuários premium podem enviar até 50MB!")
	}

	// Storage quota check for non-premium users
	if !user.IsPremium && (user.StorageUsed+originalSize) > MaxStorageFree {
		return nil, errors.New("Limite de armazenamento atingido (25MB). Seja premium para armazenamento ilimitado!")
	}

	// Decode image to get dimensions
	img, _, err := image.Decode(fileReader)
	if err != nil {
		return nil, errors.New("Formato de imagem inválido. Use PNG, JPEG ou GIF.")
	}

	bounds := img.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	// Generate unique filename and save as compressed JPEG
	filename := uuid.New().String() + ".jpg"
	filePath := filepath.Join(UploadsDir, filename)

	if err := os.MkdirAll(UploadsDir, 0755); err != nil {
		return nil, errors.New("Erro interno ao preparar diretório de uploads.")
	}

	outFile, err := os.Create(filePath)
	if err != nil {
		return nil, errors.New("Erro interno ao salvar imagem.")
	}
	defer outFile.Close()

	if err := jpeg.Encode(outFile, img, &jpeg.Options{Quality: JpegCompressQuality}); err != nil {
		os.Remove(filePath)
		return nil, errors.New("Erro ao comprimir imagem.")
	}

	// Get compressed file size
	stat, err := os.Stat(filePath)
	if err != nil {
		os.Remove(filePath)
		return nil, errors.New("Erro interno ao verificar arquivo salvo.")
	}
	compressedSize := stat.Size()

	m := &model.Map{
		CampaignID:   campaignID,
		Name:         name,
		FilePath:     filePath,
		FileSize:     compressedSize,
		OriginalSize: originalSize,
		Width:        width,
		Height:       height,
		CreatedBy:    userID,
	}

	if err := s.mapRepo.Create(ctx, m); err != nil {
		os.Remove(filePath)
		return nil, errors.New("Erro ao salvar mapa no banco de dados.")
	}

	// Update user storage
	if err := s.userRepo.UpdateStorageUsed(ctx, userID, compressedSize); err != nil {
		// Log but don't fail — eventual consistency is acceptable here
		fmt.Printf("[WARN] Failed to update storage_used for user %s: %v\n", userID, err)
	}

	return m, nil
}

func (s *MapService) GetByCampaign(ctx context.Context, campaignID, userID string) ([]model.MapSummary, error) {
	if _, err := s.checkMember(ctx, campaignID, userID, "owner", "editor", "viewer"); err != nil {
		return nil, err
	}

	maps, err := s.mapRepo.GetByCampaign(ctx, campaignID)
	if err != nil {
		return []model.MapSummary{}, errors.New("Erro ao listar mapas.")
	}
	return maps, nil
}

func (s *MapService) GetDetail(ctx context.Context, mapID, campaignID, userID string) (*model.MapDetail, error) {
	if _, err := s.checkMember(ctx, campaignID, userID, "owner", "editor", "viewer"); err != nil {
		return nil, err
	}

	m, err := s.mapRepo.GetByID(ctx, mapID)
	if err != nil {
		return nil, errors.New("Mapa não encontrado.")
	}

	if m.CampaignID != campaignID {
		return nil, customErrors.ErrUnauthorized
	}

	markers, err := s.mapRepo.GetMarkersByMap(ctx, mapID)
	if err != nil {
		return nil, errors.New("Erro ao carregar marcadores.")
	}

	return &model.MapDetail{Map: *m, Markers: markers}, nil
}

func (s *MapService) GetFilePath(ctx context.Context, mapID, campaignID, userID string) (string, error) {
	if _, err := s.checkMember(ctx, campaignID, userID, "owner", "editor", "viewer"); err != nil {
		return "", err
	}

	m, err := s.mapRepo.GetByID(ctx, mapID)
	if err != nil {
		return "", errors.New("Mapa não encontrado.")
	}

	if m.CampaignID != campaignID {
		return "", customErrors.ErrUnauthorized
	}

	return m.FilePath, nil
}

func (s *MapService) Update(ctx context.Context, mapID, campaignID, userID string, req dto.UpdateMapRequest) (*model.Map, error) {
	if _, err := s.checkMember(ctx, campaignID, userID, "owner", "editor"); err != nil {
		return nil, err
	}

	existing, err := s.mapRepo.GetByID(ctx, mapID)
	if err != nil {
		return nil, errors.New("Mapa não encontrado.")
	}
	if existing.CampaignID != campaignID {
		return nil, customErrors.ErrUnauthorized
	}

	name := existing.Name
	if req.Name != nil {
		name = *req.Name
	}

	updated, err := s.mapRepo.Update(ctx, mapID, name)
	if err != nil {
		return nil, errors.New("Erro ao atualizar mapa.")
	}
	return updated, nil
}

func (s *MapService) Delete(ctx context.Context, mapID, campaignID, userID string) error {
	if _, err := s.checkMember(ctx, campaignID, userID, "owner", "editor"); err != nil {
		return err
	}

	m, err := s.mapRepo.GetByID(ctx, mapID)
	if err != nil {
		return errors.New("Mapa não encontrado.")
	}
	if m.CampaignID != campaignID {
		return customErrors.ErrUnauthorized
	}

	// Delete file from disk
	if err := os.Remove(m.FilePath); err != nil && !os.IsNotExist(err) {
		fmt.Printf("[WARN] Failed to remove map file %s: %v\n", m.FilePath, err)
	}

	if err := s.mapRepo.Delete(ctx, mapID); err != nil {
		return errors.New("Erro ao apagar mapa.")
	}

	// Decrement user storage
	if err := s.userRepo.UpdateStorageUsed(ctx, m.CreatedBy, -m.FileSize); err != nil {
		fmt.Printf("[WARN] Failed to decrement storage_used for user %s: %v\n", m.CreatedBy, err)
	}

	return nil
}

func (s *MapService) SyncMarkers(ctx context.Context, mapID, campaignID, userID string, req dto.SyncMarkersRequest) error {
	if _, err := s.checkMember(ctx, campaignID, userID, "owner", "editor"); err != nil {
		return err
	}

	// Verify map belongs to campaign
	m, err := s.mapRepo.GetByID(ctx, mapID)
	if err != nil {
		return errors.New("Mapa não encontrado.")
	}
	if m.CampaignID != campaignID {
		return customErrors.ErrUnauthorized
	}

	markers := make([]model.MapMarker, len(req.Markers))
	for i, mr := range req.Markers {
		markers[i] = model.MapMarker{
			MapID:      mapID,
			PosX:       mr.PosX,
			PosY:       mr.PosY,
			Label:      mr.Label,
			DocumentID: mr.DocumentID,
		}
	}

	if err := s.mapRepo.SyncMarkers(ctx, mapID, markers); err != nil {
		return errors.New("Erro ao sincronizar marcadores.")
	}
	return nil
}
