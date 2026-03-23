ALTER TABLE documents ADD COLUMN is_spoiler BOOLEAN NOT NULL DEFAULT FALSE;
CREATE INDEX idx_documents_spoiler ON documents(is_spoiler);
