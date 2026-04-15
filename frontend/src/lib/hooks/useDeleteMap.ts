import { useMutation } from "@tanstack/react-query";
import { Delete } from "../api/maps";
import { toast } from "sonner";
import { getLocaleDict } from "@/lib/i18n";

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
      toast.success(getLocaleDict().toast.mapDeleted);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || "Ocorreu um erro ao remover o mapa.",
      );
    },
  });
}
