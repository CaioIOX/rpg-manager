"use client";

import useCampaigns from "@/lib/hooks/useCampaigns";
import {
  Button,
  Container,
  Grid,
  Skeleton,
  Typography,
  Stack,
} from "@mui/material";
import Box from "@mui/material/Box";
import { Campaign } from "@/lib/types/Campaign";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import CampaignCard from "./_components/CampaignCard";
import CreateCampaignModal from "./_components/CreateCampaignModal";
import { useQueryClient } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import ExploreIcon from "@mui/icons-material/Explore";

export default function CampaignPage() {
  const campaigns = useCampaigns();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 5,
            animation: "fadeInUp 0.5s ease-out",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component={"h1"}
              sx={{
                fontWeight: 700,
                background:
                  "linear-gradient(135deg, #E6E6E6 0%, #8B949E 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Minhas Campanhas
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 0.5 }}
            >
              Gerencie e explore suas aventuras épicas
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            sx={{
              px: 3,
              py: 1.2,
              fontSize: "0.95rem",
              background: "linear-gradient(135deg, #D4AF37 0%, #9E8024 100%)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #E8CC6E 0%, #D4AF37 100%)",
              },
            }}
            onClick={handleOpenModal}
          >
            Nova Campanha
          </Button>
        </Box>

        {/* Campaign Grid */}
        <Grid container spacing={3}>
          {campaigns.isPending &&
            Array.from(new Array(6)).map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={200}
                  sx={{
                    borderRadius: "20px",
                    animation: "pulse-glow 2s ease-in-out infinite",
                  }}
                />
              </Grid>
            ))}

          {!campaigns.isPending && campaigns.data?.length === 0 && (
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
                py: 10,
                animation: "fadeIn 0.6s ease-out",
              }}
            >
              <ExploreIcon
                sx={{
                  fontSize: 64,
                  color: "rgba(212, 175, 55, 0.2)",
                  mb: 2,
                }}
              />
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Nenhuma campanha encontrada
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3, maxWidth: 360, mx: "auto" }}
              >
                Crie sua primeira campanha e comece uma nova aventura épica com
                seus jogadores!
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenModal}
                sx={{ px: 3 }}
              >
                Criar Primeira Campanha
              </Button>
            </Box>
          )}
          {!campaigns.isPending &&
            campaigns.data?.map((campaign: Campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
        </Grid>
      </Container>

      <CreateCampaignModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSuccessCallback={() => {
          queryClient.invalidateQueries({ queryKey: ["campaigns"] });
        }}
      />
    </Box>
  );
}
