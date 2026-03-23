import { useQuery } from "@tanstack/react-query";
import { GetByID } from "../api/templates";

export default function useGetTemplate(campaignId: string, templateId?: string) {
  return useQuery({
    queryKey: ["template", templateId],
    queryFn: () => GetByID(campaignId, templateId!),
    enabled: !!templateId,
  });
}
