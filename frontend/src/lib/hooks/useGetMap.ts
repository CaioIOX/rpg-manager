import { useQuery } from "@tanstack/react-query";
import { GetByID } from "../api/maps";

export default function useGetMap(campaignId: string, mapId: string) {
  return useQuery({
    queryKey: ["map", campaignId, mapId],
    queryFn: () => GetByID(campaignId, mapId),
    enabled: !!campaignId && !!mapId,
  });
}
