DROP INDEX IF EXISTS idx_documents_spoiler;
ALTER TABLE documents DROP COLUMN IF EXISTS is_spoiler;
