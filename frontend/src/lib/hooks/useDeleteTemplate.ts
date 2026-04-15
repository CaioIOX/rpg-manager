import { useMutation } from "@tanstack/react-query";
import { Delete } from "../api/templates";
import { toast } from "sonner";
import { getLocaleDict } from "@/lib/i18n";

export default function useDeleteTemplate() {
  return useMutation({
    mutationFn: ({
      campaignId,
      templateId,
    }: {
      campaignId: string;
      templateId: string;
    }) => Delete(campaignId, templateId),
    onSuccess: () => {
      toast.success(getLocaleDict().toast.templateDeleted);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || getLocaleDict().toast.templateDeleteError);
    },
  });
}
