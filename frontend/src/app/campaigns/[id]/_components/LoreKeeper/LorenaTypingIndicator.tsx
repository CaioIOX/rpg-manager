"use client";

import { Avatar, Box } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

/**
 * Indicador animado "Lorena está digitando…"
 * Exibido enquanto aguarda a resposta da API Gemini.
 */
export function LorenaTypingIndicator() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.25,
        alignItems: "flex-start",
        animation: "fadeSlideIn 0.25s ease-out",
        "@keyframes fadeSlideIn": {
          from: { opacity: 0, transform: "translateY(8px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Avatar
        sx={{
          width: 30,
          height: 30,
          flexShrink: 0,
          bgcolor: "rgba(212, 175, 55, 0.12)",
          border: "1px solid rgba(212, 175, 55, 0.3)",
          mt: 0.25,
        }}
      >
        <AutoStoriesIcon sx={{ fontSize: 16, color: "primary.main" }} />
      </Avatar>

      <Box
        sx={{
          px: 1.75,
          py: 1.25,
          borderRadius: "4px 16px 16px 16px",
          bgcolor: "rgba(212, 175, 55, 0.06)",
          border: "1px solid rgba(212, 175, 55, 0.12)",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          minWidth: 56,
        }}
      >
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              bgcolor: "primary.main",
              opacity: 0.6,
              animation: "bounce 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
              "@keyframes bounce": {
                "0%, 80%, 100%": { transform: "scale(0.6)", opacity: 0.3 },
                "40%": { transform: "scale(1)", opacity: 0.9 },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
