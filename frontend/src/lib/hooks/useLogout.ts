import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Logout } from "../api/auth";

export default function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => Logout(),
    onSuccess: (message) => {
      console.log(message);
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Falha ao fazer logout: ", error);
    },
  });
}
