import { useMutation } from "@tanstack/react-query";
import { Delete } from "../api/campaigns";

export default function useDeleteCampaign() {
  return useMutation({
    mutationFn: ({ campaignId }: { campaignId: string }) => Delete(campaignId),
    onSuccess: (message) => {
      console.log(message);
    },
    onError: (error) => {
      console.error("Falha ao apagar campanha: ", error);
    },
  });
}
