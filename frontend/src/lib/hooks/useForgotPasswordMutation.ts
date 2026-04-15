import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

interface ForgotPasswordVars {
  email: string;
}

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async (vars: ForgotPasswordVars) => {
      try {
        const response = await apiClient.post("/api/auth/forgot-password", { email: vars.email });
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
