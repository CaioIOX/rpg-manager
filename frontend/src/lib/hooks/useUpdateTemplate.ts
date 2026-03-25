import { useMutation } from "@tanstack/react-query";
import { Update } from "../api/templates";
import { toast } from "sonner";

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
      toast.success("Template atualizado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Ocorreu um erro ao atualizar the template.");
    },
  });
}
