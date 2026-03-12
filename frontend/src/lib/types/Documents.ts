export interface DocumentType {
    id: string,
    CampaignID: string,
    FolderID?: string,
    TemplateID?: string,
    Title: string,
    Content: Record<string, unknown>,
    CreatedBy: string,
    CreatedAt: Date,
    UpdatedAt: Date,
}

export interface DocumentSummary {
    id: string,
    Title: string,
    FolderID?: string,
    TemplateID?: string,
    UpdatedAt: Date
}

export interface DocumentLink {
    id: string,
    SourceDocID: string,
    TargetDocID: string,
    MentionText: string,
    CreatedAt: Date,
}