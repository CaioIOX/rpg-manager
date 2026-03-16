import { useQuery } from "@tanstack/react-query";
import { GetByID } from "../api/campaigns";

export default function useGetCampaign(campaignId: string) {
  return useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: () => GetByID(campaignId),
  });
}
