import { useMutation } from "@tanstack/react-query";
import { AddMember } from "../api/campaigns";

export default function useAddMember() {
  return useMutation({
    mutationFn: ({
      campaignId,
      email,
      role,
    }: {
      campaignId: string;
      email: string;
      role: string;
    }) => AddMember(campaignId, email, role),
    onError: (error) => {
      console.error("Falha ao adicionar membro: ", error);
    },
  });
}
