"use client";

import useGetCampaign from "@/lib/hooks/useGetCampaign";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";

interface CampaignMobileHeaderProps {
  onOpenSidebar: () => void;
}

export default function CampaignMobileHeader({
  onOpenSidebar,
}: CampaignMobileHeaderProps) {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  const campaign = useGetCampaign(campaignId);

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        display: { xs: "flex", md: "none" },
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 1,
        borderBottom: "1px solid rgba(212, 175, 55, 0.08)",
        bgcolor: "rgba(13, 17, 23, 0.92)",
        backdropFilter: "blur(18px)",
      }}
    >
      <IconButton
        aria-label="Abrir navegação"
        onClick={onOpenSidebar}
        sx={{
          color: "text.primary",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "12px",
        }}
      >
        <MenuIcon />
      </IconButton>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "text.secondary",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Campanha
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {campaign.data?.name || "Carregando..."}
        </Typography>
      </Box>
      <IconButton
        aria-label="Voltar para campanhas"
        onClick={() => router.push("/campaigns")}
        sx={{
          color: "text.secondary",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "12px",
        }}
      >
        <ArrowBackIcon />
      </IconButton>
    </Box>
  );
}
