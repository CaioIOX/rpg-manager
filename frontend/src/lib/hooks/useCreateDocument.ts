import { useMutation } from "@tanstack/react-query";
import { Create } from "../api/documents";

export default function useCreateDocument() {
  return useMutation({
    mutationFn: ({
      campaignId,
      title,
      content,
      folderId,
      templateId,
      isSpoiler,
    }: {
      campaignId: string;
      title: string;
      content?: Record<string, unknown>;
      folderId?: string;
      templateId?: string;
      isSpoiler?: boolean;
    }) => Create(campaignId, title, content, folderId, templateId, isSpoiler),
    onError: (error) => {
      console.error("Falha ao criar documento: ", error);
    },
  });
}
