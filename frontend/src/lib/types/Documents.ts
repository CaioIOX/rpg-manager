export interface TypeDocument {
    id: string,
    campaign_id: string,
    folder_id?: string,
    template_id?: string,
    title: string,
    content: Record<string, unknown>,
    doc_type: 'editor' | 'whiteboard',
    is_spoiler: boolean,
    created_by: string,
    created_at: Date,
    updated_at: Date,
}

export interface DocumentSummary {
    id: string,
    title: string,
    folder_id?: string,
    template_id?: string,
    doc_type: 'editor' | 'whiteboard',
    is_spoiler: boolean,
    created_by: string,
    updated_at: Date
}

export interface DocumentLink {
    id: string,
    source_doc_id: string,
    target_doc_id: string,
    mention_text: string,
    created_at: Date,
}