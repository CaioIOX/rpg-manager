import { useMutation } from "@tanstack/react-query";
import { Update } from "../api/campaigns";
import { toast } from "sonner";

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
    onSuccess: () => {
      toast.success("Campanha atualizada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Falha ao atualizar campanha");
    },
  });
}
