import { useMutation } from "@tanstack/react-query";
import { Create } from "../api/campaigns";

export default function useCreateCampaign() {
  return useMutation({
    mutationFn: ({
      name,
      description,
    }: {
      name: string;
      description: string;
    }) => Create(name, description),
    onSuccess: (message) => {
      console.log(message);
    },
    onError: (error) => {
      console.error("Falha ao criar campanha: ", error);
    },
  });
}
