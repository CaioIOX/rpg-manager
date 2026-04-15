"use client";

import { useResetPasswordMutation } from "@/lib/hooks/useResetPasswordMutation";
import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { useState, Suspense } from "react";
import Alert from "@mui/material/Alert";
import { useLocale } from "@/lib/i18n";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { t } = useLocale();

  const resetSchema = z
    .object({
      password: z.string().min(8, t.auth.passwordMinLength),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t.auth.passwordsDontMatch,
      path: ["confirmPassword"],
    });

  type ResetFormData = z.infer<typeof resetSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const mutation = useResetPasswordMutation();
  const [success, setSuccess] = useState(false);

  const onSubmit = (data: ResetFormData) => {
    if (!token) return;

    mutation.mutate(
      { token: token, password: data.password },
      {
        onSuccess: () => {
          setSuccess(true);
        },
      },
    );
  };

  return (
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
      {!token ? (
        <Box>
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            Link inválido ou ausente. Não é possível redefinir a senha.
          </Alert>
          <Button
            variant="outlined"
            href="/"
            fullWidth
            sx={{
              borderRadius: "16px",
              py: 1.5,
              mt: 2,
            }}
          >
            {t.auth.backToLogin}
          </Button>
        </Box>
      ) : success ? (
        <Box>
          <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
            {t.auth.resetSuccess}
          </Alert>
          <Button
            variant="contained"
            href="/"
            fullWidth
            sx={{
              borderRadius: "16px",
              py: 1.5,
              mt: 2,
              background: "linear-gradient(135deg, #D4AF37 0%, #9E8024 100%)",
              color: "#000",
              fontWeight: "bold",
              "&:hover": {
                background: "linear-gradient(135deg, #E8CC6E 0%, #D4AF37 100%)",
              },
            }}
          >
            {t.auth.goToLogin}
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
            label={t.auth.resetNewPassword}
            type="password"
            placeholder="••••••••"
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                bgcolor: "rgba(13, 17, 23, 0.5)",
              },
            }}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <TextField
            label={t.auth.resetConfirmPassword}
            type="password"
            placeholder="••••••••"
            variant="outlined"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "16px",
                bgcolor: "rgba(13, 17, 23, 0.5)",
              },
            }}
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          {mutation.isError && (
            <Typography color="error" variant="body2" textAlign="center">
              {mutation.error instanceof Error
                ? mutation.error.message || t.auth.resetError
                : t.auth.resetTokenExpired}
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
              background: "linear-gradient(135deg, #D4AF37 0%, #9E8024 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #E8CC6E 0%, #D4AF37 100%)",
              },
            }}
          >
            {t.auth.resetButton}
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default function ResetPasswordPage() {
  const { t } = useLocale();

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
          {t.auth.resetTitle}
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
          {t.auth.resetSubtitle}
        </Typography>

        <Suspense fallback={<div>{t.auth.loadingForm}</div>}>
          <ResetPasswordForm />
        </Suspense>
      </Box>
    </Box>
  );
}
