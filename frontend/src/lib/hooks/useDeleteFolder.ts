import { useMutation } from "@tanstack/react-query";
import { Delete } from "../api/folders";
import { toast } from "sonner";
import { getLocaleDict } from "@/lib/i18n";

export default function useDeleteFolder() {
  return useMutation({
    mutationFn: ({ campaignId, folderId }: { campaignId: string; folderId: string }) =>
      Delete(campaignId, folderId),
    onSuccess: () => {
      toast.success(getLocaleDict().toast.folderDeleted);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || getLocaleDict().toast.folderDeleteError);
    },
  });
}
