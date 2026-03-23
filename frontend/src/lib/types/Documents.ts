export interface TypeDocument {
    id: string,
    campaignID: string,
    folder_id?: string,
    templateID?: string,
    title: string,
    content: Record<string, unknown>,
    isSpoiler: boolean,
    createdBy: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface DocumentSummary {
    id: string,
    title: string,
    folderID?: string,
    templateID?: string,
    isSpoiler: boolean,
    createdBy: string,
    updatedAt: Date
}

export interface DocumentLink {
    id: string,
    SourceDocID: string,
    targetDocID: string,
    mentionText: string,
    createdAt: Date,
}