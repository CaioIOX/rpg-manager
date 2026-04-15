import { useMutation } from "@tanstack/react-query";
import { Register } from "../api/auth";
import { toast } from "sonner";
import { getLocaleDict } from "@/lib/i18n";

export default function useRegisterMutation() {
  return useMutation({
    mutationFn: ({
      email,
      username,
      password,
    }: {
      email: string;
      username: string;
      password: string;
    }) => Register(username, email, password),
    onSuccess: () => {
      // Success handled by caller
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || getLocaleDict().toast.registerError);
    },
  });
}
