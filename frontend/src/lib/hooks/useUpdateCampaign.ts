import { useMutation } from "@tanstack/react-query";
import { Update } from "../api/campaigns";
import { toast } from "sonner";
import { getLocaleDict } from "@/lib/i18n";

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
      toast.success(getLocaleDict().toast.campaignUpdated);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || getLocaleDict().toast.campaignUpdateError);
    },
  });
}
