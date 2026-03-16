import { useQuery } from "@tanstack/react-query";
import { List } from "../api/campaigns";

export default function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: List,
  });
}
