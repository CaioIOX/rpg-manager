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
    }: {
      campaignId: string;
      documentId: string;
      title?: string;
      folderID?: string;
      content?: Record<string, unknown>;
      isSpoiler?: boolean;
    }) => Update(campaignId, documentId, title, folderID, content, isSpoiler),
    onSuccess: (message, variables) => {
      console.log(message);
      
      queryClient.setQueryData(["document", variables.documentId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          content: variables.content ?? oldData.content,
          title: variables.title ?? oldData.title,
          folder_id: variables.folderID ?? oldData.folder_id,
        };
      });
      
      queryClient.invalidateQueries({ queryKey: ["documents", variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ["document", variables.documentId] });
    },
    onError: (error: any) => {
      console.error("Falha ao atualizar documento: ", error);
      toast.error(error.response?.data?.error || "Ocorreu um erro ao salvar o documento.");
    },
  });
}
