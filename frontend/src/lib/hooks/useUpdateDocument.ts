import { useMutation } from "@tanstack/react-query";
import { Update } from "../api/documents";

export default function useUpdateDocument() {
  return useMutation({
    mutationFn: ({
      campaignId,
      documentId,
      title,
      folderID,
      content,
    }: {
      campaignId: string;
      documentId: string;
      title?: string;
      folderID?: string;
      content?: Record<string, unknown>;
    }) => Update(campaignId, documentId, title, folderID, content),
    onSuccess: (message) => {
      console.log(message);
    },
    onError: (error) => {
      console.error("Falha ao atualizar documento: ", error);
    },
  });
}
