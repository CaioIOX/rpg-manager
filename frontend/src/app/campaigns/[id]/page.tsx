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

export default function CampaignDashboard() {
  const params = useParams();
  const campaignId = params.id as string;

  const { data: documents, isLoading: isLoadingDocs } =
    useDocuments(campaignId);
  const { data: templates, isLoading: isLoadingTemplates } =
    useTemplates(campaignId);

  const totalDocuments = documents?.length ?? 0;
  const totalTemplates = templates?.length ?? 0;

  return (
    <Box sx={{ p: 4 }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, fontWeight: "bold", color: "text.primary" }}
      >
        Visão Geral da Campanha
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "primary.light",
                    color: "primary.main",
                  }}
                >
                  <DescriptionIcon />
                </Box>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  Total de Documentos
                </Typography>
              </Stack>

              {isLoadingDocs ? (
                <CircularProgress size={28} sx={{ mt: 1 }} />
              ) : (
                <Typography variant="h3" fontWeight="bold">
                  {totalDocuments}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ mb: 2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "secondary.light",
                    color: "secondary.main",
                  }}
                >
                  <SettingsIcon />
                </Box>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  Total de Templates
                </Typography>
              </Stack>

              {isLoadingTemplates ? (
                <CircularProgress size={28} sx={{ mt: 1 }} />
              ) : (
                <Typography variant="h3" fontWeight="bold">
                  {totalTemplates}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
