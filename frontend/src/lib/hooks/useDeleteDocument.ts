import { useMutation } from "@tanstack/react-query";
import { Delete } from "../api/documents";

export default function useDeleteDocument() {
  return useMutation({
    mutationFn: ({
      campaignId,
      documentId,
    }: {
      campaignId: string;
      documentId: string;
    }) => Delete(campaignId, documentId),
    onError: (error) => {
      console.error("Falha ao apagar documento: ", error);
    },
  });
}
