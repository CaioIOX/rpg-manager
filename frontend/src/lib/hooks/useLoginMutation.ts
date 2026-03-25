import { useMutation } from "@tanstack/react-query";
import { Login } from "../api/auth";
import { toast } from "sonner";

export function useLoginMutation() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      Login(email, password),
    onSuccess: () => {
      // Success handled by caller
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Falha ao logar");
    },
  });
}
