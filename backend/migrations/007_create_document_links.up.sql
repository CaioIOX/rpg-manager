CREATE TABLE document_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_doc_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    target_doc_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    mention_text VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(source_doc_id, target_doc_id, mention_text)
);

CREATE INDEX idx_document_links_source ON document_links(source_doc_id);
CREATE INDEX idx_document_links_target ON document_links(target_doc_id);