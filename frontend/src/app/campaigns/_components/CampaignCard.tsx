"use client";

import { Campaign } from "@/lib/types/Campaign";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const router = useRouter();

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={campaign.id}>
      <Box
        sx={{
          height: "100%",
          "&:hover .campaign-card": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 16px rgba(212, 175, 55, 0.15)",
            borderColor: "primary.main",
          },
        }}
      >
        <Card
          className="campaign-card"
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.paper",
            border: "1px solid transparent",
            borderRadius: "20px",
            transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
          }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              component={"h2"}
              color="primary.main"
              gutterBottom
              fontWeight={"bold"}
            >
              {campaign.name || "Campanha sem nome."}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {campaign.description || ""}
            </Typography>
          </CardContent>

          <CardActions sx={{ px: 2, pb: 2 }}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ borderRadius: "15px" }}
              onClick={() => router.push(`/campaigns/${campaign.id}`)}
            >
              Entrar na Campanha
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Grid>
  );
}
