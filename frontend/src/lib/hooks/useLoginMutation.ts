import { useMutation } from "@tanstack/react-query";
import { Login } from "../api/auth";

export function useLoginMutation() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      Login(email, password),
    onSuccess: (message) => {
      console.log(message);
    },
    onError: (error) => {
      console.error("Falha ao logar: ", error);
    },
  });
}
