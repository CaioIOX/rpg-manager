export interface Template {
    id: string,
    campaign_id: string,
    name: string,
    description?: string,
    icon?: string,
    schema: Record<string, unknown>,
    default_content?: Record<string, unknown>,
    created_at: Date,
    updated_at: Date,
}
