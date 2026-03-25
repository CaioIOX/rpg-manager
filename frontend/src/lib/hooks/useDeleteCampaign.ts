import { useMutation } from "@tanstack/react-query";
import { Delete } from "../api/campaigns";
import { toast } from "sonner";

export default function useDeleteCampaign() {
  return useMutation({
    mutationFn: ({ campaignId }: { campaignId: string }) => Delete(campaignId),
    onSuccess: () => {
      // toast.success("Campanha apagada com sucesso!"); // Optional if already handled by component
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Falha ao apagar campanha");
    },
  });
}
