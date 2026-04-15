"use client";

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DescriptionIcon from "@mui/icons-material/Description";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { DocumentSummary } from "@/lib/types/Documents";
import { Template } from "@/lib/types/Template";
import { useLocale } from "@/lib/i18n";

interface RecentDocumentsCardProps {
  documents: DocumentSummary[] | undefined;
  templates: Template[] | undefined;
  campaignId: string;
  isLoading: boolean;
}

export default function RecentDocumentsCard({
  documents,
  templates,
  campaignId,
  isLoading,
}: RecentDocumentsCardProps) {
  const router = useRouter();
  const { t, locale } = useLocale();

  const recentDocuments = useMemo(() => {
    if (!documents) return [];
    return [...documents]
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .slice(0, 5);
  }, [documents]);

  return (
    <Box sx={{ mt: { xs: 3, md: 5 }, animation: "fadeInUp 0.6s ease-out" }}>
      <Card
        sx={{
          borderRadius: { xs: "18px", md: "20px" },
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(13, 17, 23, 0.4)",
          backdropFilter: "blur(10px)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box
              sx={{
                display: "flex",
                p: { xs: 1, md: 1.2 },
                borderRadius: "12px",
                bgcolor: "rgba(46, 160, 67, 0.15)",
                color: "#3FB950",
                border: "1px solid rgba(46, 160, 67, 0.2)",
              }}
            >
              <HistoryIcon sx={{ fontSize: "1.2rem" }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                color: "text.primary",
              }}
            >
              {t.dashboard.recentDocs}
            </Typography>
          </Stack>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress size={32} sx={{ color: "#3FB950" }} />
            </Box>
          ) : recentDocuments.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", textAlign: "center", py: 4 }}
            >
              {t.dashboard.noDocsFound}
            </Typography>
          ) : (
            <Stack spacing={1}>
              {recentDocuments.map((doc) => {
                const templateIcon = doc.template_id
                  ? templates?.find((t) => t.id === doc.template_id)?.icon
                  : undefined;
                
                return (
                  <Box
                    key={doc.id}
                    onClick={() =>
                      router.push(`/campaigns/${campaignId}/docs/${doc.id}`)
                    }
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 2,
                      borderRadius: "14px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      border: "1px solid rgba(255,255,255,0.03)",
                      bgcolor: "rgba(255,255,255,0.02)",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.06)",
                        borderColor: "rgba(255,255,255,0.1)",
                        transform: "translateY(-1px)",
                        "& .chevron": {
                          transform: "translateX(4px)",
                          color: "text.primary",
                        },
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 36,
                          height: 36,
                          borderRadius: "10px",
                          bgcolor: "rgba(255,255,255,0.05)",
                          flexShrink: 0,
                        }}
                      >
                        {templateIcon ? (
                          <Box sx={{ fontSize: "1.2rem", lineHeight: 1 }}>{templateIcon}</Box>
                        ) : (
                          <DescriptionIcon sx={{ fontSize: "1.2rem", color: "text.secondary" }} />
                        )}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 500,
                            color: "text.primary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            mb: 0.2,
                          }}
                        >
                          {doc.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary", display: "block" }}
                        >
                          {t.dashboard.editedAt}: {new Date(doc.updated_at).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </Box>
                    </Stack>
                    <ChevronRightIcon
                      className="chevron"
                      sx={{
                        color: "text.secondary",
                        transition: "all 0.2s ease",
                        ml: 2,
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
