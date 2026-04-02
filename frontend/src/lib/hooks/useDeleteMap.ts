import { useMutation } from "@tanstack/react-query";
import { Delete } from "../api/maps";
import { toast } from "sonner";

export default function useDeleteMap() {
  return useMutation({
    mutationFn: ({
      campaignId,
      mapId,
    }: {
      campaignId: string;
      mapId: string;
    }) => Delete(campaignId, mapId),
    onSuccess: () => {
      toast.success("Mapa removido com sucesso!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Ocorreu um erro ao remover o mapa.",
      );
    },
  });
}
