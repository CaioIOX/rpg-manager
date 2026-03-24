export interface TypeDocument {
    id: string,
    campaign_id: string,
    folder_id?: string,
    template_id?: string,
    title: string,
    content: Record<string, unknown>,
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
    is_spoiler: boolean,
    created_by: string,
    updated_at: Date
}

export interface DocumentLink {
    id: string,
    SourceDocID: string,
    targetDocID: string,
    mentionText: string,
    createdAt: Date,
}