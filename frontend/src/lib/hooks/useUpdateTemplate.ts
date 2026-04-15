import { useMutation } from "@tanstack/react-query";
import { Update } from "../api/templates";
import { toast } from "sonner";
import { getLocaleDict } from "@/lib/i18n";

export default function useUpdateTemplate() {
  return useMutation({
    mutationFn: ({
      campaignId,
      templateId,
      name,
      schema,
      defaultContent,
      description,
      icon,
    }: {
      campaignId: string;
      templateId: string;
      name?: string;
      schema?: Record<string, unknown>;
      defaultContent?: Record<string, unknown>;
      description?: string;
      icon?: string;
    }) =>
      Update(
        campaignId,
        templateId,
        name,
        schema,
        defaultContent,
        description,
        icon,
      ),
    onSuccess: () => {
      toast.success(getLocaleDict().toast.templateUpdated);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || getLocaleDict().toast.templateUpdateError);
    },
  });
}
