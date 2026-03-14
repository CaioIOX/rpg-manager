"use client";

import useRegisterMutation from "@/lib/hooks/useRegisterMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const registerSchema = z.object({
  email: z.email("Email inválido").min(1, "Email obrigatório"),
  username: z.string().min(3, "Username obrigatório."),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useRegisterMutation();

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(
      {
        email: data.email,
        username: data.username,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.push("/auth/login");
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
        label="Username"
        variant="outlined"
        fullWidth
        {...register("username")}
        error={!!errors.username}
        helperText={errors.username?.message}
        sx={{
          "& .MuiOutlinedInput-root": { borderRadius: "20px" },
        }}
      />
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
        placeholder="*****"
        variant="outlined"
        fullWidth
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        sx={{
          "& .MuiOutlinedInput-root": { borderRadius: "20px" },
        }}
      />

      {registerMutation.isError && (
        <Typography color="error" variant="body2" textAlign="center">
          {registerMutation.error instanceof Error
            ? registerMutation.error.message
            : "Erro ao realizar cadastro"}
        </Typography>
      )}
      <Button
        variant="contained"
        type="submit"
        size="large"
        loading={registerMutation.isPending}
        sx={{ borderRadius: "20px", textTransform: "none" }}
      >
        {registerMutation.isPending ? "Carregando..." : "Cadastrar"}
      </Button>
    </Box>
  );
}
