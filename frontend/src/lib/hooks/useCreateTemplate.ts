import { useMutation } from "@tanstack/react-query";
import { Create } from "../api/templates";

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
    onError: (error) => {
      console.error("Falha ao criar template: ", error);
    },
  });
}
