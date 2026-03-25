import { useMutation } from "@tanstack/react-query";
import { Update } from "../api/folders";
import { toast } from "sonner";

export default function useUpdateFolder() {
  return useMutation({
    mutationFn: ({
      campaignId,
      folderId,
      name,
      position,
      parentId,
    }: {
      campaignId: string;
      folderId: string;
      name: string;
      position?: number;
      parentId?: string;
    }) => Update(campaignId, folderId, name, position, parentId),
    onSuccess: (message) => {
      console.log(message);
      toast.success("Pasta atualizada com sucesso!");
    },
    onError: (error: any) => {
      console.error("Falha ao atualizar pasta: ", error);
      toast.error(error.response?.data?.error || "Ocorreu um erro ao atualizar a pasta.");
    },
  });
}
