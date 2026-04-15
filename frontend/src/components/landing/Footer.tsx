"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useLocale } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLocale();
  return (
    <Box
      sx={{
        py: 4,
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          align="center"
          sx={{ color: "text.secondary", fontSize: "0.9rem" }}
        >
          © {new Date().getFullYear()} CodexLore. {t.landing.footer}
        </Typography>
      </Container>
    </Box>
  );
}
