import { useMutation } from "@tanstack/react-query";
import { GoogleAuth } from "../api/auth";

export function useGoogleLoginMutation() {
  return useMutation({
    mutationFn: (credential: string) => GoogleAuth(credential),
    onSuccess: (message) => {
      console.log(message);
    },
    onError: (error) => {
      console.error("Falha ao logar com Google: ", error);
    },
  });
}
