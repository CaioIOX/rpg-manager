import { Members } from "./Members"

export interface Campaign {
    id: string,
    name: string,
    description?: string,
    ownerID: string,
    createdAt: Date,
    updatedAt: Date
}

export interface CampaignWithRole extends Campaign {
    role: string
}

export interface CampaignDetailsResponse extends Campaign {
    members: Members[]
}
