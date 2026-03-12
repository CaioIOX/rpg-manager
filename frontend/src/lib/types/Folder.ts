export interface Folder {
    id: string,
    CampaignID: string,
    ParentID?: string,
    Name: string,
    Position: number,
    CreatedAt: Date,
    UpdatedAt: Date
}