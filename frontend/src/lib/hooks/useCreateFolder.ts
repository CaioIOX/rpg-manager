import { useMutation } from "@tanstack/react-query";
import { Create } from "../api/folders";
import { toast } from "sonner";

export default function useCreateFolder() {
  return useMutation({
    mutationFn: ({
      campaignId,
      name,
      parentId,
    }: {
      campaignId: string;
      name: string;
      parentId?: string;
    }) => Create(campaignId, name, parentId),
    onSuccess: () => {
      toast.success("Pasta criada com sucesso!");
    },
    onError: (error: any) => {
      console.error("Falha ao criar pasta: ", error);
      toast.error(error.response?.data?.error || "Ocorreu um erro ao criar a pasta.");
    },
  });
}
