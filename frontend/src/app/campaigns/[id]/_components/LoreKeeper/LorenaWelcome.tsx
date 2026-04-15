"use client";

import { Box, Typography } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import { useLocale } from "@/lib/i18n";

/**
 * Tela de boas-vindas quando não há nenhuma mensagem ainda.
 * Introduz a Lorena como personagem — grimório mímico da campanha.
 */
export function LorenaWelcome() {
  const { t } = useLocale();
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
        py: 4,
        gap: 2,
      }}
    >
      {/* Ícone animado */}
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          bgcolor: "rgba(212, 175, 55, 0.08)",
          border: "1.5px solid rgba(212, 175, 55, 0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "floatBook 3s ease-in-out infinite",
          boxShadow: "0 0 20px rgba(212, 175, 55, 0.12)",
          "@keyframes floatBook": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-6px)" },
          },
        }}
      >
        <AutoStoriesIcon sx={{ fontSize: 34, color: "primary.main" }} />
      </Box>

      <Box>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Merriweather", serif',
            color: "primary.main",
            fontWeight: 700,
            fontSize: "1.1rem",
            mb: 0.75,
          }}
        >
          {t.lorena.welcomeTitle}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: "0.85rem",
            lineHeight: 1.7,
            maxWidth: 280,
          }}
        >
          {t.lorena.welcomeDesc}
        </Typography>
      </Box>

      <Box
        sx={{
          mt: 1,
          px: 2,
          py: 1.25,
          borderRadius: 2,
          bgcolor: "rgba(212, 175, 55, 0.05)",
          border: "1px dashed rgba(212, 175, 55, 0.2)",
          maxWidth: 280,
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", fontSize: "0.78rem", lineHeight: 1.5 }}
        >
          {t.lorena.welcomeHint}
        </Typography>
      </Box>
    </Box>
  );
}
