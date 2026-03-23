import { useQuery } from "@tanstack/react-query";
import { List } from "../api/documents";

export default function useDocuments(campaignId: string) {
  return useQuery({
    queryKey: ["documents", campaignId],
    queryFn: () => List(campaignId),
  });
}
