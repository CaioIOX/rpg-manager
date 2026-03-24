import { useMutation } from "@tanstack/react-query";
import { Update } from "../api/templates";

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
    onSuccess: (message) => {
      console.log(message);
    },
    onError: (error) => {
      console.error("Falha ao atualizar template: ", error);
    },
  });
}
