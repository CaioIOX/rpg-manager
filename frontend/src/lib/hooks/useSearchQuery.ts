import { useQuery } from "@tanstack/react-query";
import { Search } from "../api/documents";

export default function useSearchQuery(campaigId: string, q: string) {
  return useQuery({
    queryKey: ["search"],
    queryFn: () => Search(campaigId, q),
    enabled: !!q,
  });
}
