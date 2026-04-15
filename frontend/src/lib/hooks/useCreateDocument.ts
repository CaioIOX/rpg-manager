import { useMutation } from "@tanstack/react-query";
import { Create } from "../api/documents";
import { toast } from "sonner";
import { getLocaleDict } from "@/lib/i18n";

export default function useCreateDocument() {
  return useMutation({
    mutationFn: ({
      campaignId,
      title,
      content,
      folderId,
      templateId,
      isSpoiler,
    }: {
      campaignId: string;
      title: string;
      content?: Record<string, unknown>;
      folderId?: string;
      templateId?: string;
      isSpoiler?: boolean;
    }) => Create(campaignId, title, content, folderId, templateId, isSpoiler),
    onSuccess: () => {
      toast.success(getLocaleDict().toast.docCreated);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || getLocaleDict().toast.docCreateError);
    },
  });
}
