"use client";

import { useMemo } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { DocumentSummary } from "@/lib/types/Documents";
import { Template } from "@/lib/types/Template";

interface StatCardsProps {
  documents: DocumentSummary[] | undefined;
  templates: Template[] | undefined;
  isLoadingDocs: boolean;
  isLoadingTemplates: boolean;
}

const COLOR_PALETTES = [
  { iconColor: "#4FC3F7", borderColor: "rgba(79, 195, 247, 0.15)", gradient: "linear-gradient(135deg, rgba(79, 195, 247, 0.15) 0%, rgba(79, 195, 247, 0.05) 100%)" },
  { iconColor: "#81C784", borderColor: "rgba(129, 199, 132, 0.15)", gradient: "linear-gradient(135deg, rgba(129, 199, 132, 0.15) 0%, rgba(129, 199, 132, 0.05) 100%)" },
  { iconColor: "#E57373", borderColor: "rgba(229, 115, 115, 0.15)", gradient: "linear-gradient(135deg, rgba(229, 115, 115, 0.15) 0%, rgba(229, 115, 115, 0.05) 100%)" },
  { iconColor: "#FFB74D", borderColor: "rgba(255, 183, 77, 0.15)", gradient: "linear-gradient(135deg, rgba(255, 183, 77, 0.15) 0%, rgba(255, 183, 77, 0.05) 100%)" },
  { iconColor: "#4DB6AC", borderColor: "rgba(77, 182, 172, 0.15)", gradient: "linear-gradient(135deg, rgba(77, 182, 172, 0.15) 0%, rgba(77, 182, 172, 0.05) 100%)" },
  { iconColor: "#7986CB", borderColor: "rgba(121, 134, 203, 0.15)", gradient: "linear-gradient(135deg, rgba(121, 134, 203, 0.15) 0%, rgba(121, 134, 203, 0.05) 100%)" },
];

export default function StatCards({
  documents,
  templates,
  isLoadingDocs,
  isLoadingTemplates,
}: StatCardsProps) {
  const allCards = useMemo(() => {
    const totalDocuments = documents?.length ?? 0;
    const totalTemplates = templates?.length ?? 0;

    const baseCards = [
      {
        label: "Total de Documentos",
        value: totalDocuments,
        isLoading: isLoadingDocs,
        icon: <DescriptionIcon fontSize="small" />,
        gradient:
          "linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%)",
        iconColor: "#D4AF37",
        borderColor: "rgba(212, 175, 55, 0.15)",
      },
      {
        label: "Total de Templates",
        value: totalTemplates,
        isLoading: isLoadingTemplates,
        icon: <SettingsIcon fontSize="small" />,
        gradient:
          "linear-gradient(135deg, rgba(142, 36, 170, 0.15) 0%, rgba(142, 36, 170, 0.05) 100%)",
        iconColor: "#BA68C8",
        borderColor: "rgba(142, 36, 170, 0.15)",
      },
    ];

    if (!documents || !templates || templates.length === 0) {
      return baseCards;
    }

    // Calcula uso de templates
    const templateUsage = templates.map((template) => {
      const count = documents.filter((doc) => doc.template_id === template.id).length;
      return { template, count };
    });

    // Filtra templates em uso e ordena pelos mais usados
    const usedTemplates = templateUsage
      .filter((t) => t.count > 0)
      .sort((a, b) => b.count - a.count);

    // Limita máximo de 6 novos cards para evitar poluição/scroll na página
    const topTemplates = usedTemplates.slice(0, 6);

    const dynamicCards = topTemplates.map((item, index) => {
      const palette = COLOR_PALETTES[index % COLOR_PALETTES.length];
      return {
        label: item.template.name,
        value: item.count,
        isLoading: false,
        icon: <span style={{ fontSize: "1.2rem", lineHeight: 1, display: "inline-block" }}>{item.template.icon || "📄"}</span>,
        gradient: palette.gradient,
        iconColor: palette.iconColor,
        borderColor: palette.borderColor,
      };
    });

    return [...baseCards, ...dynamicCards];
  }, [documents, templates, isLoadingDocs, isLoadingTemplates]);

  return (
    <Grid container spacing={2}>
      {allCards.map((card, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
          <Card
            sx={{
              borderRadius: { xs: "14px", md: "16px" },
              border: "1px solid",
              borderColor: card.borderColor,
              background: card.gradient,
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              height: "100%",
              "&:hover": {
                transform: "translateY(-2px)",
                borderColor: card.iconColor,
              }
            }}
          >
            <CardContent sx={{ p: { xs: 1.5, md: 2 }, "&:last-child": { pb: { xs: 1.5, md: 2 } } }}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{ mb: 1.5 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    p: 1,
                    borderRadius: "10px",
                    bgcolor: "rgba(255,255,255,0.05)",
                    color: card.iconColor,
                    border: "1px solid rgba(255,255,255,0.05)",
                    width: 34,
                    height: 34,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {card.icon}
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={card.label}
                >
                  {card.label}
                </Typography>
              </Stack>

              {card.isLoading ? (
                <CircularProgress
                  size={20}
                  sx={{ mt: 0.5, color: card.iconColor }}
                />
              ) : (
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    fontFamily: '"Inter", sans-serif',
                    color: "text.primary",
                    lineHeight: 1,
                    fontSize: { xs: "1.75rem", md: "2.25rem" },
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
  );
}
