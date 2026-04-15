import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

interface ResetPasswordVars {
  token: string;
  password: string;
}

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: async (vars: ResetPasswordVars) => {
      try {
        const response = await apiClient.post("/api/auth/reset-password", { token: vars.token, password: vars.password });
        return response.data;
      } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
           throw new Error(error.response.data.error);
        }
        throw error;
      }
    },
  });
};
