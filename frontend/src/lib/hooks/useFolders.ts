import { useQuery } from "@tanstack/react-query";
import { List } from "../api/folders";

export default function useFolders(campaignId: string) {
  return useQuery({
    queryKey: ["folders", campaignId],
    queryFn: () => List(campaignId),
  });
}
