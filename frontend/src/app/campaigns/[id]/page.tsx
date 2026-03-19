"use client";

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Stack,
} from "@mui/material";
import { useParams } from "next/navigation";
import useDocuments from "@/lib/hooks/useDocuments";
import useTemplates from "@/lib/hooks/useTemplates";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export default function CampaignDashboard() {
  const params = useParams();
  const campaignId = params.id as string;

  const { data: documents, isLoading: isLoadingDocs } =
    useDocuments(campaignId);
  const { data: templates, isLoading: isLoadingTemplates } =
    useTemplates(campaignId);

  const totalDocuments = documents?.length ?? 0;
  const totalTemplates = templates?.length ?? 0;

  const statCards = [
    {
      label: "Total de Documentos",
      value: totalDocuments,
      isLoading: isLoadingDocs,
      icon: <DescriptionIcon />,
      gradient: "linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)",
      iconColor: "#D4AF37",
      borderColor: "rgba(212, 175, 55, 0.15)",
    },
    {
      label: "Total de Templates",
      value: totalTemplates,
      isLoading: isLoadingTemplates,
      icon: <SettingsIcon />,
      gradient: "linear-gradient(135deg, rgba(142, 36, 170, 0.15) 0%, rgba(142, 36, 170, 0.05) 100%)",
      iconColor: "#BA68C8",
      borderColor: "rgba(142, 36, 170, 0.15)",
    },
  ];

  return (
    <Box sx={{ p: { xs: 3, md: 5 } }}>
      <Box sx={{ mb: 4, animation: "fadeInUp 0.5s ease-out" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #E6E6E6 0%, #8B949E 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 0.5,
          }}
        >
          Visão Geral
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Acompanhe o progresso da sua campanha
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card
              sx={{
                borderRadius: "20px",
                border: "1px solid",
                borderColor: card.borderColor,
                background: card.gradient,
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ mb: 2.5 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      p: 1.5,
                      borderRadius: "14px",
                      bgcolor: "rgba(255,255,255,0.05)",
                      color: card.iconColor,
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 500,
                    }}
                  >
                    {card.label}
                  </Typography>
                </Stack>

                {card.isLoading ? (
                  <CircularProgress
                    size={28}
                    sx={{ mt: 1, color: card.iconColor }}
                  />
                ) : (
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      fontFamily: '"Inter", sans-serif',
                      color: "text.primary",
                      lineHeight: 1,
                    }}
                  >
                    {card.value}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
