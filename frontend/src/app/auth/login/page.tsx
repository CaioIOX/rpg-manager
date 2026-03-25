"use client";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/lib/hooks/useLoginMutation";
import { useGoogleLoginMutation } from "@/lib/hooks/useGoogleLoginMutation";
import { GoogleLogin } from "@react-oauth/google";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const loginSchema = z.object({
  email: z.email("Email inválido.").min(1, "Email obrigatório."),
  password: z.string().min(1, "Senha obrigatória."),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const loginMutation = useLoginMutation();
  const googleLoginMutation = useGoogleLoginMutation();

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          router.push("/campaigns");
        },
      },
    );
  };

  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        width: "100%",
        maxWidth: "400px",
        mx: "auto",
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 0.5 }}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              googleLoginMutation.mutate(credentialResponse.credential, {
                onSuccess: () => {
                  router.push("/campaigns");
                }
              });
            }
          }}
          onError={() => {
            console.error('Falha no Login com o Google');
          }}
          theme="filled_black"
          shape="pill"
          text="continue_with"
        />
      </Box>

      <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", mt: -1, mb: -1 }}>
        ou com email
      </Typography>

      <TextField
        label="Email"
        placeholder="exemplo@gmail.com"
        variant="outlined"
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            bgcolor: "rgba(13, 17, 23, 0.5)",
          },
        }}
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Senha"
        type="password"
        placeholder="••••••••"
        variant="outlined"
        fullWidth
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            bgcolor: "rgba(13, 17, 23, 0.5)",
          },
        }}
      />

      {loginMutation.isError && (
        <Typography color="error" variant="body2" textAlign="center">
          {loginMutation.error instanceof Error
            ? loginMutation.error.message
            : "Erro ao realizar login"}
        </Typography>
      )}
      <Button
        variant="contained"
        type="submit"
        size="large"
        loading={loginMutation.isPending}
        sx={{
          borderRadius: "16px",
          py: { xs: 1.35, md: 1.5 },
          fontSize: "1rem",
          background: "linear-gradient(135deg, #D4AF37 0%, #9E8024 100%)",
          "&:hover": {
            background: "linear-gradient(135deg, #E8CC6E 0%, #D4AF37 100%)",
          },
        }}
      >
        Entrar
      </Button>

      <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
        Não tem uma conta?{" "}
        <Link
          href="/auth/register"
          sx={{
            color: "primary.main",
            fontWeight: 600,
            textDecoration: "none",
            transition: "color 0.2s",
            "&:hover": {
              color: "primary.light",
              textDecoration: "underline",
            },
          }}
        >
          Cadastre-se
        </Link>
      </Typography>
    </Box>
  );
}
