import { useMutation } from "@tanstack/react-query";
import { Update } from "../api/folders";

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
    },
    onError: (error) => {
      console.error("Falha ao atualizar pasta: ", error);
    },
  });
}
