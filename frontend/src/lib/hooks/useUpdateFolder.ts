import { useMutation } from "@tanstack/react-query";
import { Update } from "../api/folders";
import { toast } from "sonner";
import { getLocaleDict } from "@/lib/i18n";

export default function useUpdateFolder() {
  return useMutation({
    mutationFn: ({
      campaignId,
      folderId,
      name,
      position,
      parentId,
      color,
    }: {
      campaignId: string;
      folderId: string;
      name: string;
      position?: number;
      parentId?: string;
      color?: string;
    }) => Update(campaignId, folderId, name, position, parentId, color),
    onSuccess: () => {
      toast.success(getLocaleDict().toast.folderUpdated);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || getLocaleDict().toast.folderUpdateError);
    },
  });
}
