import { useMutation } from "@tanstack/react-query";
import { Update } from "../api/maps";
import { toast } from "sonner";

export default function useUpdateMap() {
  return useMutation({
    mutationFn: ({
      campaignId,
      mapId,
      name,
    }: {
      campaignId: string;
      mapId: string;
      name: string;
    }) => Update(campaignId, mapId, name),
    onSuccess: () => {
      toast.success("Mapa atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Ocorreu um erro ao atualizar o mapa.",
      );
    },
  });
}
