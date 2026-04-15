import { useMutation } from "@tanstack/react-query";
import { AddMember } from "../api/campaigns";
import { toast } from "sonner";
import { getLocaleDict } from "@/lib/i18n";

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
      toast.error(error.response?.data?.error || getLocaleDict().toast.addMemberError);
    },
  });
}
