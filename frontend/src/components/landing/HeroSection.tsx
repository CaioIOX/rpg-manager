"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import { keyframes } from "@mui/system";
import { useLocale } from "@/lib/i18n";

// ─── Animations ───────────────────────────────────────────────────────────────

const float = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(3deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const floatReverse = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(20px) rotate(-3deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const fadeInScale = keyframes`
  0% { opacity: 0; transform: scale(0.95) translateY(40px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function HeroSection() {
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
        px: { xs: 2, sm: 4 },
        py: { xs: 8, md: 10 },
        overflow: "hidden",
      }}
    >
      {/* Background Orbs */}
      <Box
        sx={{
          position: "absolute",
          width: { xs: "300px", md: "500px" },
          height: { xs: "300px", md: "500px" },
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 60%)",
          top: "-10%",
          right: "-10%",
          pointerEvents: "none",
          animation: `${float} 8s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: { xs: "250px", md: "400px" },
          height: { xs: "250px", md: "400px" },
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(142, 36, 170, 0.09) 0%, transparent 65%)",
          bottom: "10%",
          left: "-5%",
          pointerEvents: "none",
          animation: `${floatReverse} 10s ease-in-out infinite`,
        }}
      />

      {/* Hero Text */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          maxWidth: "800px",
          animation: `${fadeInUp} 1s ease-out forwards`,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "3rem", sm: "4.5rem", md: "5.5rem" },
            lineHeight: 1.1,
            mb: 2,
            background:
              "linear-gradient(135deg, #FFFFFF 0%, #D4AF37 50%, #9E8024 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
          }}
        >
          {t.landing.heroTitle.split("\n")[0]}
          <br />
          {t.landing.heroTitle.split("\n")[1]}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
            fontWeight: 400,
            mb: 5,
            mx: "auto",
            maxWidth: "600px",
            lineHeight: 1.6,
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          {t.landing.heroSubtitle}{" "}
          <strong style={{ color: "#D4AF37" }}>{t.landing.heroSubtitleBrand}</strong>
          {t.landing.heroSubtitleEnd}
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            component={Link}
            href="/auth/register"
            variant="contained"
            size="large"
            sx={{
              borderRadius: "16px",
              py: 1.8,
              px: { xs: 4, md: 5 },
              fontSize: "1.05rem",
              fontWeight: 700,
              textTransform: "none",
              background:
                "linear-gradient(135deg, #D4AF37 0%, #9E8024 100%)",
              boxShadow: "0 8px 24px rgba(212, 175, 55, 0.25)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #E8CC6E 0%, #D4AF37 100%)",
                boxShadow: "0 12px 32px rgba(212, 175, 55, 0.35)",
              },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {t.landing.ctaStart}
          </Button>

          <Button
            component={Link}
            href="/auth/login"
            variant="outlined"
            size="large"
            sx={{
              borderRadius: "16px",
              py: 1.6,
              px: { xs: 4, md: 5 },
              fontSize: "1.05rem",
              fontWeight: 600,
              textTransform: "none",
              color: "text.primary",
              borderColor: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              "&:hover": {
                borderColor: "rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.05)",
              },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {t.landing.ctaLogin}
          </Button>
        </Stack>
      </Box>

      {/* Hero Screenshot — Dashboard */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          mt: { xs: 6, md: 8 },
          width: "100%",
          maxWidth: "1100px",
          animation: `${fadeInScale} 1.2s 0.3s ease-out both`,
        }}
      >
        {/* Glow behind the image */}
        <Box
          sx={{
            position: "absolute",
            inset: "-20%",
            background:
              "radial-gradient(ellipse at center, rgba(212, 175, 55, 0.08) 0%, rgba(142, 36, 170, 0.06) 40%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <Box
          component="img"
          src="/screenshots/dashboard.png"
          alt="CodexLore — Dashboard da campanha com visão geral de documentos, templates e mapas"
          sx={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "auto",
            borderRadius: { xs: "12px", md: "16px" },
            border: "1px solid rgba(212, 175, 55, 0.15)",
            boxShadow:
              "0 25px 60px -12px rgba(0, 0, 0, 0.6), 0 0 80px rgba(212, 175, 55, 0.08)",
          }}
        />
      </Box>
    </Box>
  );
}
