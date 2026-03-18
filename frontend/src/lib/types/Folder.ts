export interface Folder {
    id: string,
    campaignID: string,
    parentID?: string,
    name: string,
    position: number,
    createdAt: Date,
    updatedAt: Date
}