"use client";

import { useForgotPasswordMutation } from "@/lib/hooks/useForgotPasswordMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import z from "zod";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useState } from "react";
import Alert from "@mui/material/Alert";

const forgotSchema = z.object({
  email: z.string().email("Email inválido.").min(1, "Email obrigatório."),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const mutation = useForgotPasswordMutation();
  const [success, setSuccess] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  const onSubmit = (data: ForgotFormData) => {
    mutation.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          setSuccess(true);
        },
        onError: (err: any) => {
          if (err.message === "EMAIL_DAILY_LIMIT_EXCEEDED") {
            setLimitReached(true);
          }
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
          Redefinir Senha
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
          Esqueceu sua senha? Insira seu email e enviaremos um link de recuperação se sua conta existir.
        </Typography>

        {/* Card */}
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
          {success ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                Email de redefinição enviado com sucesso! Verifique sua caixa de entrada ou spam.
              </Alert>
              <Button
                variant="outlined"
                href="/"
                fullWidth
                sx={{
                  borderRadius: "16px",
                  py: 1.5,
                  mt: 2
                }}
              >
                Voltar para o Login
              </Button>
            </Box>
          ) : limitReached ? (
            <Box>
              <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                Os serviços de email estão temporariamente indisponíveis por conta do limite diário do nosso servidor gratuito. Por favor, tente novamente amanhã.
              </Alert>
              <Button
                variant="outlined"
                href="/"
                fullWidth
                sx={{
                  borderRadius: "16px",
                  py: 1.5,
                  mt: 2
                }}
              >
                Voltar para o Login
              </Button>
            </Box>
          ) : (
            <Box
              component={"form"}
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, sm: 2.5 },
              }}
            >
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

              {mutation.isError && !limitReached && (
                <Typography color="error" variant="body2" textAlign="center">
                  Ocorreu um erro ao enviar. Verifique o email e tente novamente.
                </Typography>
              )}

              <Button
                variant="contained"
                type="submit"
                size="large"
                loading={mutation.isPending}
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
                Enviar Link
              </Button>

              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 0.5 }}
              >
                Lembrou a senha?{" "}
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
          )}
        </Box>
      </Box>
    </Box>
  );
}
