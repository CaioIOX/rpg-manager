import { useMutation } from "@tanstack/react-query";
import { Delete } from "../api/folders";
import { toast } from "sonner";

export default function useDeleteFolder() {
  return useMutation({
    mutationFn: ({ campaignId, folderId }: { campaignId: string; folderId: string }) =>
      Delete(campaignId, folderId),
    onSuccess: () => {
      toast.success("Pasta removida com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Ocorreu um erro ao apagar a pasta.");
    },
  });
}
