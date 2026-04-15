import { useQuery } from "@tanstack/react-query";
import { List } from "../api/maps";

export default function useMaps(campaignId: string) {
  return useQuery({
    queryKey: ["maps", campaignId],
    queryFn: () => List(campaignId),
    enabled: !!campaignId,
  });
}
