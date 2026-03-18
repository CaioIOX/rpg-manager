import { useQuery } from "@tanstack/react-query";
import { GetByID } from "../api/documents";

export default function useGetDocument(campaignId: string, documentId: string) {
  return useQuery({
    queryKey: ["document", documentId],
    queryFn: () => GetByID(campaignId, documentId),
  });
}
