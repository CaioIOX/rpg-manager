import { useMutation } from "@tanstack/react-query";
import { Register } from "../api/auth";

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
    onSuccess: (message) => {
      console.log(message);
    },
    onError: (error) => {
      console.error("Falha ao cadastrar: ", error);
    },
  });
}
