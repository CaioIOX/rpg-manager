import { useMutation } from "@tanstack/react-query";
import { Create } from "../api/folders";
import { toast } from "sonner";
import { getLocaleDict } from "@/lib/i18n";

export default function useCreateFolder() {
  return useMutation({
    mutationFn: ({
      campaignId,
      name,
      parentId,
      color,
    }: {
      campaignId: string;
      name: string;
      parentId?: string;
      color?: string;
    }) => Create(campaignId, name, parentId, color),
    onSuccess: () => {
      toast.success(getLocaleDict().toast.folderCreated);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || getLocaleDict().toast.folderCreateError);
    },
  });
}
