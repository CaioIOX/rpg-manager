import { useMutation } from "@tanstack/react-query";
import { SyncMarkers } from "../api/maps";
import { MapMarker } from "../types/Map";
import { toast } from "sonner";
import { getLocaleDict } from "@/lib/i18n";

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
      toast.success(getLocaleDict().toast.markersSaved);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error ||
          getLocaleDict().toast.markersError,
      );
    },
  });
}
