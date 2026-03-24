import { useMutation } from "@tanstack/react-query";
import { Delete } from "../api/templates";

export default function useDeleteTemplate() {
  return useMutation({
    mutationFn: ({
      campaignId,
      templateId,
    }: {
      campaignId: string;
      templateId: string;
    }) => Delete(campaignId, templateId),
    onSuccess: (message) => {
      console.log(message);
    },
    onError: (error) => {
      console.error("Falha ao apagar template: ", error);
    },
  });
}
