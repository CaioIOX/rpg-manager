"use client";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "@/lib/hooks/useLoginMutation";
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

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: () => {
          router.push("/campaign");
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
        gap: 3,
        maxWidth: "400px",
        mx: "auto",
      }}
    >
      <TextField
        label="Email"
        placeholder="exemplo@gmail.com"
        variant="outlined"
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": { borderRadius: "20px" },
        }}
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Senha"
        type="password"
        placeholder="******"
        variant="outlined"
        fullWidth
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        sx={{
          "& .MuiOutlinedInput-root": { borderRadius: "20px" },
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
        sx={{ borderRadius: "20px", textTransform: "none" }}
      >
        Entrar
      </Button>

      <Typography variant="body2" gutterBottom>
        Não tem uma conta?{" "}
        <Link color="#0000ff" underline="hover" href="/auth/register">
          Cadastre-se
        </Link>
      </Typography>
    </Box>
  );
}
