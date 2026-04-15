"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import GroupsIcon from "@mui/icons-material/Groups";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import MapIcon from "@mui/icons-material/Map";
import { useLocale } from "@/lib/i18n";

// ─── Feature card ─────────────────────────────────────────────────────────────

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        height: "100%",
        bgcolor: "rgba(22, 27, 34, 0.4)",
        border: "1px solid rgba(212, 175, 55, 0.08)",
        borderRadius: "24px",
        p: { xs: 3, md: 4 },
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          borderColor: "rgba(212, 175, 55, 0.18)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        },
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "14px",
          bgcolor: "rgba(255, 255, 255, 0.03)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2.5,
          boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, mb: 1.5, color: "text.primary", fontSize: "1.1rem" }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          lineHeight: 1.7,
          fontSize: "0.93rem",
          flex: 1,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function FeaturesSection() {
  const { t } = useLocale();

  const features = [
    {
      title: t.landing.featureEditor,
      description: t.landing.featureEditorDesc,
      icon: <AutoFixHighIcon sx={{ fontSize: "1.75rem", color: "#D4AF37" }} />,
    },
    {
      title: t.landing.featureMentions,
      description: t.landing.featureMentionsDesc,
      icon: <AccountTreeIcon sx={{ fontSize: "1.75rem", color: "#BA68C8" }} />,
    },
    {
      title: t.landing.featureTemplates,
      description: t.landing.featureTemplatesDesc,
      icon: <DashboardCustomizeIcon sx={{ fontSize: "1.75rem", color: "#D4AF37" }} />,
    },
    {
      title: t.landing.featureMultiplayer,
      description: t.landing.featureMultiplayerDesc,
      icon: <GroupsIcon sx={{ fontSize: "1.75rem", color: "#BA68C8" }} />,
    },
    {
      title: t.landing.featureLorena,
      description: t.landing.featureLorenaDesc,
      icon: <SmartToyIcon sx={{ fontSize: "1.75rem", color: "#D4AF37" }} />,
    },
    {
      title: t.landing.featureMaps,
      description: t.landing.featureMapsDesc,
      icon: <MapIcon sx={{ fontSize: "1.75rem", color: "#BA68C8" }} />,
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        py: { xs: 8, md: 14 },
        bgcolor: "background.default",
        borderTop: "1px solid rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 800,
            mb: { xs: 2, md: 3 },
            background: "linear-gradient(135deg, #FFFFFF 0%, #BA68C8 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          {t.landing.featuresTitle}
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{
            mx: "auto",
            mb: { xs: 6, md: 8 },
            color: "text.secondary",
            maxWidth: 600,
            fontSize: "1.1rem",
            lineHeight: 1.6,
          }}
        >
          {t.landing.featuresSubtitle}
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature, idx) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
