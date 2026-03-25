import { useMutation } from "@tanstack/react-query";
import { Create } from "../api/campaigns";
import { toast } from "sonner";

export default function useCreateCampaign() {
  return useMutation({
    mutationFn: ({
      name,
      description,
    }: {
      name: string;
      description?: string;
    }) => Create(name, description),
    onSuccess: () => {
      // Success is handled by the calling component or could be added here
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Falha ao criar campanha");
    },
  });
}
