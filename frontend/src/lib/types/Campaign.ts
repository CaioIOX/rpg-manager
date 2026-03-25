import { Members } from "./Members";

export interface Campaign {
  id: string;
  name: string;
  description?: string;
  ownerID: string;
  created_at: Date;
  updated_at: Date;
}

export interface CampaignWithRole extends Campaign {
  role: string;
}

export interface CampaignDetailsResponse extends Campaign {
  members: Members[];
}
