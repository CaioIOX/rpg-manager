import { useMutation } from "@tanstack/react-query";
import { Update } from "../api/campaigns";

export default function useUpdateCampaign() {
  return useMutation({
    mutationFn: ({
      campaignId,
      name,
      description,
    }: {
      campaignId: string;
      name: string;
      description?: string;
    }) => Update(campaignId, name, description),
    onSuccess: (message) => {
      console.log(message);
    },
    onError: (error) => {
      console.error("Falha ao atualizar campanha: ", error);
    },
  });
}
