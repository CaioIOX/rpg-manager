"use client";

import Box from "@mui/material/Box";
import { useLocale, type Locale } from "@/lib/i18n";

// ─── Compact PT | EN toggle ──────────────────────────────────────────────────

const options: { value: Locale; label: string }[] = [
  { value: "pt", label: "PT" },
  { value: "en", label: "EN" },
];

export default function LanguageSwitch() {
  const { locale, setLocale } = useLocale();

  return (
    <Box
      sx={{
        display: "inline-flex",
        borderRadius: "10px",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      {options.map((opt) => {
        const isActive = locale === opt.value;
        return (
          <Box
            key={opt.value}
            component="button"
            onClick={() => setLocale(opt.value)}
            sx={{
              all: "unset",
              px: 1.2,
              py: 0.4,
              fontSize: "0.72rem",
              fontWeight: isActive ? 700 : 500,
              letterSpacing: "0.04em",
              cursor: "pointer",
              color: isActive ? "#D4AF37" : "text.secondary",
              bgcolor: isActive
                ? "rgba(212, 175, 55, 0.1)"
                : "transparent",
              transition: "all 0.2s ease",
              "&:hover": {
                color: isActive ? "#D4AF37" : "text.primary",
                bgcolor: isActive
                  ? "rgba(212, 175, 55, 0.1)"
                  : "rgba(255,255,255,0.04)",
              },
            }}
          >
            {opt.label}
          </Box>
        );
      })}
    </Box>
  );
}
