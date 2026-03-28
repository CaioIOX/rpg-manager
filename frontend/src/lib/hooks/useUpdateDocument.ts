import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Update } from "../api/documents";
import { toast } from "sonner";

export default function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      campaignId,
      documentId,
      title,
      folderID,
      content,
      isSpoiler,
      yjsState,
    }: {
      campaignId: string;
      documentId: string;
      title?: string;
      folderID?: string;
      content?: Record<string, unknown>;
      isSpoiler?: boolean;
      yjsState?: string;
    }) => Update(campaignId, documentId, title, folderID, content, isSpoiler, yjsState),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["document", variables.documentId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          content: variables.content ?? oldData.content,
          title: variables.title ?? oldData.title,
          folder_id: variables.folderID ?? oldData.folder_id,
        };
      });

      // Só invalida a lista de documentos ao mudar título ou pasta (visível na sidebar)
      if (variables.title !== undefined || variables.folderID !== undefined) {
        queryClient.invalidateQueries({ queryKey: ["documents", variables.campaignId] });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Ocorreu um erro ao salvar o documento.");
    },
  });
}
