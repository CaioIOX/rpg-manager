export interface Template {
    id: string,
    CampaignID: string,
    Name: string,
    Description?: string,
    Icon?: string,
    Schema: Record<string, unknown>,
    DefaultContent?: Record<string, unknown>,
    CreatedAt: Date,
    UpdatedAt: Date,
}
