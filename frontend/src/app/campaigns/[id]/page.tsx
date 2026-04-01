"use client";

import RecentDocumentsCard from "./_components/RecentDocumentsCard";
import StatCards from "./_components/StatCards";
import {
  Box,
  Typography,
} from "@mui/material";
import { useParams } from "next/navigation";
import useDocuments from "@/lib/hooks/useDocuments";
import useTemplates from "@/lib/hooks/useTemplates";

export default function CampaignDashboard() {
  const params = useParams();
  const campaignId = params.id as string;

  const { data: documents, isLoading: isLoadingDocs } =
    useDocuments(campaignId);
  const { data: templates, isLoading: isLoadingTemplates } =
    useTemplates(campaignId);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 5 } }}>
      <Box sx={{ mb: { xs: 3, md: 4 }, animation: "fadeInUp 0.5s ease-out" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #E6E6E6 0%, #8B949E 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 0.5,
            fontSize: { xs: "1.8rem", sm: "2.125rem" },
          }}
        >
          Visao Geral
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Acompanhe o progresso da sua campanha
        </Typography>
      </Box>

      <StatCards
        documents={documents}
        templates={templates}
        isLoadingDocs={isLoadingDocs}
        isLoadingTemplates={isLoadingTemplates}
      />

      <RecentDocumentsCard
        documents={documents}
        templates={templates}
        campaignId={campaignId}
        isLoading={isLoadingDocs}
      />
    </Box>
  );
}
