import { useMutation } from "@tanstack/react-query";
import { Delete } from "../api/folders";

export default function useDeleteFolder() {
  return useMutation({
    mutationFn: ({ campaignId, folderId }: { campaignId: string; folderId: string }) =>
      Delete(campaignId, folderId),
    onSuccess: (message) => {
      console.log(message);
    },
    onError: (error) => {
      console.error("Falha ao apagar pasta: ", error);
    },
  });
}
