package repository

import (
	"context"
	"encoding/json"

	"github.com/CaioIOX/rpg-manager/backend/internal/dto"
	"github.com/CaioIOX/rpg-manager/backend/internal/model"
	"github.com/jackc/pgx/v5/pgxpool"
)

type DocumentRepository struct {
	db *pgxpool.Pool
}

func NewDocumentRepository(db *pgxpool.Pool) *DocumentRepository {
	return &DocumentRepository{db: db}
}

func (r *DocumentRepository) Create(ctx context.Context, document *model.Document) error {
	query := `INSERT INTO documents (campaign_id, folder_id, template_id, title, content, is_spoiler, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, created_at, updated_at`
	content := document.Content

	if content == nil {
		content = json.RawMessage{}
	}
	return r.db.QueryRow(ctx, query, document.CampaignID, document.FolderID, document.TemplateID, document.Title, content, document.IsSpoiler, document.CreatedBy).Scan(&document.ID, &document.CreatedAt, &document.UpdatedAt)
}

func (r *DocumentRepository) GetByID(ctx context.Context, id string) (*model.Document, error) {
	doc := &model.Document{}
	query := `
		SELECT id, campaign_id, folder_id, template_id, title, content, yjs_state, is_spoiler, created_by, created_at, updated_at
		FROM documents
		WHERE id = $1`

	err := r.db.QueryRow(ctx, query, id).Scan(&doc.ID, &doc.CampaignID, &doc.FolderID, &doc.TemplateID, &doc.Title, &doc.Content, &doc.YjsState, &doc.IsSpoiler, &doc.CreatedBy, &doc.CreatedAt, &doc.UpdatedAt)
	if err != nil {
		return nil, err
	}

	return doc, nil
}

func (r *DocumentRepository) GetByCampaign(ctx context.Context, campaignID string) ([]model.DocumentSummary, error) {
	query := `SELECT id, title, folder_id, template_id, is_spoiler, created_by, updated_at FROM documents WHERE campaign_id = $1 ORDER BY updated_at DESC`
	rows, err := r.db.Query(ctx, query, campaignID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	docs := make([]model.DocumentSummary, 0)
	for rows.Next() {
		var d model.DocumentSummary
		err := rows.Scan(&d.ID, &d.Title, &d.FolderID, &d.TemplateID, &d.IsSpoiler, &d.CreatedBy, &d.UpdatedAt)
		if err != nil {
			return nil, err
		}
		docs = append(docs, d)
	}
	return docs, rows.Err()
}

func (r *DocumentRepository) GetByFolder(ctx context.Context, folderID string) ([]model.DocumentSummary, error) {
	query := `SELECT id, title, folder_id, template_id, is_spoiler, created_by, updated_at
		FROM documents 
		WHERE folder_id = $1 
		ORDER BY title`
	rows, err := r.db.Query(ctx, query, folderID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	docs := make([]model.DocumentSummary, 0)
	for rows.Next() {
		var d model.DocumentSummary
		err := rows.Scan(&d.ID, &d.Title, &d.FolderID, &d.TemplateID, &d.IsSpoiler, &d.CreatedBy, &d.UpdatedAt)
		if err != nil {
			return nil, err
		}
		docs = append(docs, d)
	}
	return docs, rows.Err()
}

func (r *DocumentRepository) Update(ctx context.Context, id string, req dto.UpdateDocumentRequest) (*model.Document, error) {
	doc := &model.Document{}
	query := `
		UPDATE documents 
		SET title = COALESCE($1, title), folder_id = COALESCE($2, folder_id), content = COALESCE($3, content), yjs_state = COALESCE($4, yjs_state), is_spoiler = COALESCE($5, is_spoiler), updated_at = NOW()
		WHERE id = $6
		RETURNING id, campaign_id, folder_id, template_id, title, content, is_spoiler, created_by, created_at, updated_at`
	var contentArg interface{}
	if req.Content != nil {
		contentArg = req.Content
	}
	err := r.db.QueryRow(ctx, query, req.Title, req.FolderID, contentArg, req.YjsState, req.IsSpoiler, id).Scan(&doc.ID, &doc.CampaignID, &doc.FolderID, &doc.TemplateID, &doc.Title, &doc.Content, &doc.IsSpoiler, &doc.CreatedBy, &doc.CreatedAt, &doc.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return doc, nil
}

func (r *DocumentRepository) UpdateYjsState(ctx context.Context, id string, state []byte) error {
	_, err := r.db.Exec(ctx, `UPDATE documents SET yjs_state = $1, updated_at = NOW() WHERE id =$2`, state, id)
	return err
}

func (r *DocumentRepository) Delete(ctx context.Context, id string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM documents WHERE id = $1`, id)
	return err
}

func (r *DocumentRepository) CreateLink(ctx context.Context, link *model.DocumentLink) error {
	query := `INSERT INTO document_links (source_doc_id, target_doc_id, mention_text) VALUES ($1, $2, $3) ON CONFLICT (source_doc_id, target_doc_id, mention_text) DO NOTHING RETURNING id, created_at`

	return r.db.QueryRow(ctx, query, link.SourceDocID, link.TargetDocID, link.MentionText).Scan(&link.ID, &link.CreatedAt)
}

func (r *DocumentRepository) GetLinksFrom(ctx context.Context, docID string) ([]model.DocumentLink, error) {
	query := `SELECT id, source_doc_id, target_doc_id, mention_text, created_at FROM document_links WHERE source_doc_id = $1`
	rows, err := r.db.Query(ctx, query, docID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	links := make([]model.DocumentLink, 0)
	for rows.Next() {
		var l model.DocumentLink
		err := rows.Scan(&l.ID, &l.SourceDocID, &l.TargetDocID, &l.MentionText, &l.CreatedAt)
		if err != nil {
			return nil, err
		}
		links = append(links, l)
	}

	return links, rows.Err()
}

func (r *DocumentRepository) GetLinksTo(ctx context.Context, docID string) ([]model.DocumentLink, error) {
	query := `SELECT id, source_doc_id, target_doc_id, mention_text, created_at FROM document_links WHERE target_doc_id = $1`
	rows, err := r.db.Query(ctx, query, docID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	links := make([]model.DocumentLink, 0)
	for rows.Next() {
		var l model.DocumentLink
		err := rows.Scan(&l.ID, &l.SourceDocID, &l.TargetDocID, &l.MentionText, &l.CreatedAt)
		if err != nil {
			return nil, err
		}
		links = append(links, l)
	}

	return links, rows.Err()
}

func (r *DocumentRepository) DeleteLinksFrom(ctx context.Context, docID string) error {
	_, err := r.db.Exec(ctx, `DELETE FROM document_links WHERE source_doc_id = $1`, docID)
	return err
}

func (r *DocumentRepository) SearchByTitle(ctx context.Context, campaignID, query string) ([]model.DocumentSummary, error) {
	sqlQuery := `SELECT id, title, folder_id, template_id, is_spoiler, created_by, updated_at FROM documents WHERE campaign_id = $1 AND title ILIKE '%' || $2 || '%' ORDER BY title LIMIT 20`
	rows, err := r.db.Query(ctx, sqlQuery, campaignID, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	docs := make([]model.DocumentSummary, 0)
	for rows.Next() {
		var d model.DocumentSummary
		err := rows.Scan(&d.ID, &d.Title, &d.FolderID, &d.TemplateID, &d.IsSpoiler, &d.CreatedBy, &d.UpdatedAt)
		if err != nil {
			return nil, err
		}
		docs = append(docs, d)
	}

	return docs, rows.Err()
}

func (r *DocumentRepository) SyncLinks(ctx context.Context, docID string, links []model.DocumentLink) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	// Delete old links
	_, err = tx.Exec(ctx, `DELETE FROM document_links WHERE source_doc_id = $1`, docID)
	if err != nil {
		return err
	}

	// Insert new links
	for _, link := range links {
		query := `INSERT INTO document_links (source_doc_id, target_doc_id, mention_text) 
                  VALUES ($1, $2, $3) 
                  ON CONFLICT (source_doc_id, target_doc_id, mention_text) DO NOTHING`
		_, err = tx.Exec(ctx, query, docID, link.TargetDocID, link.MentionText)
		if err != nil {
			return err
		}
	}

	return tx.Commit(ctx)
}
