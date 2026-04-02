import { useMutation } from "@tanstack/react-query";
import { SyncMarkers } from "../api/maps";
import { MapMarker } from "../types/Map";
import { toast } from "sonner";

export default function useSyncMapMarkers() {
  return useMutation({
    mutationFn: ({
      campaignId,
      mapId,
      markers,
    }: {
      campaignId: string;
      mapId: string;
      markers: Omit<MapMarker, "id" | "map_id" | "created_at">[];
    }) => SyncMarkers(campaignId, mapId, markers),
    onSuccess: () => {
      toast.success("Marcadores salvos com sucesso!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error ||
          "Ocorreu um erro ao salvar os marcadores.",
      );
    },
  });
}
