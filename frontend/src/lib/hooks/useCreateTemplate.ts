import { useMutation } from "@tanstack/react-query";
import { Create } from "../api/templates";
import { toast } from "sonner";
import { getLocaleDict } from "@/lib/i18n";

export default function useCreateTemplate() {
  return useMutation({
    mutationFn: ({
      campaignId,
      name,
      schema,
      defaultContent,
      description,
      icon,
    }: {
      campaignId: string;
      name: string;
      schema: Record<string, unknown>;
      defaultContent?: Record<string, unknown>;
      description?: string;
      icon?: string;
    }) => Create(campaignId, name, schema, defaultContent, description, icon),
    onSuccess: () => {
      toast.success(getLocaleDict().toast.templateCreated);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || getLocaleDict().toast.templateCreateError);
    },
  });
}
