import { useMutation } from "@tanstack/react-query";
import { Upload } from "../api/maps";
import { toast } from "sonner";
import { getLocaleDict } from "@/lib/i18n";

export default function useCreateMap() {
  return useMutation({
    mutationFn: ({
      campaignId,
      name,
      file,
      onProgress,
    }: {
      campaignId: string;
      name: string;
      file: File;
      onProgress?: (percent: number) => void;
    }) => Upload(campaignId, name, file, onProgress),
    onSuccess: () => {
      toast.success(getLocaleDict().toast.mapCreated);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.error || getLocaleDict().toast.mapCreateError,
      );
    },
  });
}
