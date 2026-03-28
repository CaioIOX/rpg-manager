import { useQuery } from "@tanstack/react-query";
import { Search } from "../api/documents";

export default function useSearchQuery(campaignId: string, q: string) {
  return useQuery({
    queryKey: ["search", campaignId, q],
    queryFn: () => Search(campaignId, q),
    enabled: q.length >= 2,
    staleTime: 30_000,
  });
}
