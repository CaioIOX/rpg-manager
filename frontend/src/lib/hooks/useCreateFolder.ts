import { useMutation } from "@tanstack/react-query";
import { Create } from "../api/folders";

export default function useCreateFolder() {
  return useMutation({
    mutationFn: ({
      campaignId,
      name,
      parentId,
    }: {
      campaignId: string;
      name: string;
      parentId?: string;
    }) => Create(campaignId, name, parentId),
    onError: (error) => {
      console.error("Falha ao criar pasta: ", error);
    },
  });
}
