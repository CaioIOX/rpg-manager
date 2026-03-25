export interface Folder {
    id: string,
    campaign_id: string,
    parent_id?: string,
    name: string,
    position: number,
    created_at: Date,
    color?: string | null,
    updated_at: Date
}
