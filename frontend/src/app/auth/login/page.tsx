import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3 },
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "440px",
          p: { xs: 2.5, sm: 4 },
          borderRadius: { xs: "20px", md: "24px" },
          bgcolor: "rgba(22, 27, 34, 0.8)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(212, 175, 55, 0.12)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            textAlign: "center",
            fontWeight: 700,
            background: "linear-gradient(135deg, #D4AF37 0%, #E8CC6E 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Entrar no CodexLore
        </Typography>
        <LoginForm />
      </Box>
    </Box>
  );
}
