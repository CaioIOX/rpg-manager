import { useMutation } from "@tanstack/react-query";
import { Delete } from "../api/documents";
import { toast } from "sonner";
import { getLocaleDict } from "@/lib/i18n";

export default function useDeleteDocument() {
  return useMutation({
    mutationFn: ({
      campaignId,
      documentId,
    }: {
      campaignId: string;
      documentId: string;
    }) => Delete(campaignId, documentId),
    onSuccess: () => {
      toast.success(getLocaleDict().toast.docDeleted);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || getLocaleDict().toast.docDeleteError);
    },
  });
}
