import { useQuery } from "@tanstack/react-query";
import { List } from "../api/documents";

export default function useFolders(campaignId: string) {
  return useQuery({
    queryKey: ["templates"],
    queryFn: () => List(campaignId),
  });
}
