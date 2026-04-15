import { useMutation } from "@tanstack/react-query";
import { Update } from "../api/maps";
import { toast } from "sonner";
import { getLocaleDict } from "@/lib/i18n";

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
      toast.success(getLocaleDict().toast.mapUpdated);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || getLocaleDict().toast.mapUpdateError,
      );
    },
  });
}
