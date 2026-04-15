import { useMutation } from "@tanstack/react-query";
import { GoogleAuth } from "../api/auth";
import { toast } from "sonner";
import { getLocaleDict } from "@/lib/i18n";

export function useGoogleLoginMutation() {
  return useMutation({
    mutationFn: (credential: string) => GoogleAuth(credential),
    onSuccess: () => {
      // Success handled by caller
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || getLocaleDict().toast.googleLoginError);
    },
  });
}
