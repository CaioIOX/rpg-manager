import { useMutation } from "@tanstack/react-query";
import { Delete } from "../api/documents";
import { toast } from "sonner";

export default function useDeleteDocument() {
  return useMutation({
    mutationFn: ({
      campaignId,
      documentId,
    }: {
      campaignId: string;
      documentId: string;
    }) => Delete(campaignId, documentId),
    onSuccess: () => {
      toast.success("Documento removido com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Ocorreu um erro ao apagar o documento.");
    },
  });
}
