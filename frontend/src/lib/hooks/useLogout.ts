import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Logout } from "../api/auth";
import { toast } from "sonner";
import { getLocaleDict } from "@/lib/i18n";

export default function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => Logout(),
    onSuccess: () => {
      queryClient.clear();
      toast.success("Sessão encerrada com sucesso");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || getLocaleDict().toast.logoutError);
    },
  });
}
