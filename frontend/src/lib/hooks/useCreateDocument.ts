import { useMutation } from "@tanstack/react-query";
import { Create } from "../api/documents";
import { toast } from "sonner";

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
    onSuccess: () => {
      toast.success("Documento criado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Ocorreu um erro ao criar o documento.");
    },
  });
}
