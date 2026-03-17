import { useMutation } from "@tanstack/react-query";
import { Create } from "../api/documents";

export default function useCreateDocument() {
  return useMutation({
    mutationFn: ({
      campaignId,
      title,
      
      folderId,
    }: {
      campaignId: string;
      title: string;
      content: Record<string, unknown>;
      folderId?: string;
    }) => Create(campaignId, title, folderId),
    onSuccess: (message) => {
      console.log(message);
    },
    onError: (error) => {
      console.error("Falha ao criar campanha: ", error);
    },
  });
}
