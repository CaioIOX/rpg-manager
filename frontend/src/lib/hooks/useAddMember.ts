import { useMutation } from "@tanstack/react-query";
import { AddMember } from "../api/campaigns";
import { toast } from "sonner";

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
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Falha ao adicionar membro");
    },
  });
}
