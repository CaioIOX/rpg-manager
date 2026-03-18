export interface Template {
    id: string,
    campaignID: string,
    name: string,
    description?: string,
    icon?: string,
    schema: Record<string, unknown>,
    defaultContent?: Record<string, unknown>,
    createdAt: Date,
    updatedAt: Date,
}
