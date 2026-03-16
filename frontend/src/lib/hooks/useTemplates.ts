import { useQuery } from "@tanstack/react-query";
import { List } from "../api/templates";

export default function useTemplates(campaignId: string) {
  return useQuery({
    queryKey: ["templates"],
    queryFn: () => List(campaignId),
  });
}
