import { useMutation } from "@tanstack/react-query";
import { Delete } from "../api/templates";
import { toast } from "sonner";

export default function useDeleteTemplate() {
  return useMutation({
    mutationFn: ({
      campaignId,
      templateId,
    }: {
      campaignId: string;
      templateId: string;
    }) => Delete(campaignId, templateId),
    onSuccess: (message) => {
      console.log(message);
      toast.success("Template removido com sucesso!");
    },
    onError: (error: any) => {
      console.error("Falha ao apagar template: ", error);
      toast.error(error.response?.data?.error || "Ocorreu um erro ao apagar o template.");
    },
  });
}
