import { useMutation } from "@tanstack/react-query";
import { Create } from "../api/templates";
import { toast } from "sonner";

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
      toast.success("Template criado com sucesso!");
    },
    onError: (error: any) => {
      console.error("Falha ao criar template: ", error);
      toast.error(error.response?.data?.error || "Ocorreu um erro ao criar o template.");
    },
  });
}
