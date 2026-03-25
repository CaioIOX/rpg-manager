import { useMutation } from "@tanstack/react-query";
import { Create } from "../api/folders";
import { toast } from "sonner";

export default function useCreateFolder() {
  return useMutation({
    mutationFn: ({
      campaignId,
      name,
      parentId,
      color,
    }: {
      campaignId: string;
      name: string;
      parentId?: string;
      color?: string;
    }) => Create(campaignId, name, parentId, color),
    onSuccess: () => {
      toast.success("Pasta criada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Ocorreu um erro ao criar a pasta.");
    },
  });
}
