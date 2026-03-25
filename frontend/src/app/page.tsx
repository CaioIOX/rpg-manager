import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LoginPage from "./auth/login/page";

export default function Home() {
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
            "radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 70%)",
          top: "-150px",
          right: "-100px",
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
            "radial-gradient(circle, rgba(142, 36, 170, 0.05) 0%, transparent 70%)",
          bottom: "-100px",
          left: "-80px",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212, 175, 55, 0.04) 0%, transparent 70%)",
          top: "40%",
          left: "15%",
          pointerEvents: "none",
          animation: "float 6s ease-in-out infinite",
        }}
      />

      {/* Main content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          animation: "fadeInUp 0.6s ease-out",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 900,
            background: "linear-gradient(135deg, #D4AF37 0%, #E8CC6E 50%, #D4AF37 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          CodexLore
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: 5,
            maxWidth: "400px",
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          Gerencie suas campanhas, documente suas aventuras e colabore com
          seus jogadores em tempo real.
        </Typography>

        {/* Login Card */}
        <Box
          sx={{
            maxWidth: "440px",
            mx: "auto",
            p: 4,
            borderRadius: "24px",
            bgcolor: "rgba(22, 27, 34, 0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(212, 175, 55, 0.12)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(212, 175, 55, 0.04)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              color: "text.primary",
              fontWeight: 600,
            }}
          >
            Entrar na sua conta
          </Typography>
          <LoginPage />
        </Box>
      </Box>
    </Box>
  );
}
