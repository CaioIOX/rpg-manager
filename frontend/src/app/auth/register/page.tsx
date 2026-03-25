"use client";

import useRegisterMutation from "@/lib/hooks/useRegisterMutation";
import { useGoogleLoginMutation } from "@/lib/hooks/useGoogleLoginMutation";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

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
  const googleLoginMutation = useGoogleLoginMutation();

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(
      {
        email: data.email,
        username: data.username,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.push("/");
        },
      },
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        px: { xs: 2, sm: 3 },
        py: { xs: 4, md: 6 },
        bgcolor: "background.default",
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(142, 36, 170, 0.06) 0%, transparent 70%)",
          top: "-150px",
          left: "-100px",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)",
          bottom: "-100px",
          right: "-80px",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          animation: "fadeInUp 0.6s ease-out",
          width: "100%",
          maxWidth: "520px",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 900,
            background:
              "linear-gradient(135deg, #D4AF37 0%, #E8CC6E 50%, #D4AF37 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
            fontSize: { xs: "2rem", sm: "3rem" },
          }}
        >
          Criar Conta
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: { xs: 3, md: 5 },
            maxWidth: "380px",
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          Junte-se à aventura. Crie sua conta e comece a gerenciar suas
          campanhas.
        </Typography>

        {/* Register Card */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "440px",
            mx: "auto",
            p: { xs: 2.5, sm: 4 },
            borderRadius: { xs: "20px", md: "24px" },
            bgcolor: "rgba(22, 27, 34, 0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(212, 175, 55, 0.12)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(212, 175, 55, 0.04)",
          }}
        >
          <Box
            component={"form"}
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, sm: 2.5 },
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
                   toast.error('Falha no Login com o Google');
                 }}
                 theme="filled_black"
                 shape="pill"
                 text="signup_with"
               />
            </Box>

            <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", mt: -1, mb: -1 }}>
               ou cadastre-se com email
            </Typography>

            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  bgcolor: "rgba(13, 17, 23, 0.5)",
                },
              }}
            />
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
              sx={{
                borderRadius: "16px",
                py: 1.5,
                fontSize: "1rem",
                background:
                  "linear-gradient(135deg, #D4AF37 0%, #9E8024 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #E8CC6E 0%, #D4AF37 100%)",
                },
              }}
            >
              Cadastrar
            </Button>

            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 0.5 }}
            >
              Já tem uma conta?{" "}
              <Link
                href="/"
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
                Fazer login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
