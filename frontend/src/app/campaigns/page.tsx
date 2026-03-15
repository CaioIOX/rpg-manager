"use client";

import useCampaigns from "@/lib/hooks/useCampaigns";
import { Button, Container, Grid, Skeleton, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Campaign } from "@/lib/types/Campaign";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import CampaignCard from "./_components/CampaignCard";
import CreateCampaignModal from "./_components/CreateCampaignModal";
import { useQueryClient } from "@tanstack/react-query";

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
        textAlign: "center",
        bgcolor: "background.default",
      }}
    >
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            component={"h1"}
            color="text.primary"
            sx={{ fontFamily: '"Merriweather", "Georgia", serif' }}
          >
            Minhas Campanhas
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: "20px", px: 3 }}
            onClick={handleOpenModal}
          >
            + Nova Campanha
          </Button>
        </Box>

        <Grid container spacing={3}>
          {campaigns.isPending &&
            Array.from(new Array(15)).map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Skeleton
                  variant="rectangular"
                  height={200}
                  sx={{
                    borderRadius: "20px",
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                  }}
                />
              </Grid>
            ))}

          {!campaigns.isPending && campaigns.data?.length === 0 && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 4, width: "100%", textAlign: "center" }}
            >
              Nenhuma campanha encontrada. Comece uma nova aventura!
            </Typography>
          )}
          {!campaigns.isPending &&
            campaigns.data?.map((campaign: Campaign) => (
              <CampaignCard campaign={campaign} />
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
