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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const router = useRouter();

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={campaign.id}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          borderRadius: "20px",
          border: "1px solid rgba(212, 175, 55, 0.08)",
          position: "relative",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background:
              "linear-gradient(90deg, #D4AF37, #8E24AA, #D4AF37)",
            opacity: 0,
            transition: "opacity 0.3s ease",
          },
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow:
              "0 12px 40px rgba(212, 175, 55, 0.12), 0 4px 12px rgba(0,0,0,0.3)",
            borderColor: "rgba(212, 175, 55, 0.2)",
            "&::before": {
              opacity: 1,
            },
          },
        }}
        onClick={() => router.push(`/campaigns/${campaign.id}`)}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box
              sx={{
                p: 1,
                borderRadius: "12px",
                bgcolor: "rgba(212, 175, 55, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AutoStoriesIcon
                sx={{ color: "primary.main", fontSize: "1.3rem" }}
              />
            </Box>
          </Box>
          <Typography
            variant="h6"
            component={"h2"}
            sx={{
              color: "text.primary",
              fontWeight: 700,
              mb: 1,
              lineHeight: 1.3,
            }}
          >
            {campaign.name || "Campanha sem nome"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {campaign.description || "Sem descrição"}
          </Typography>
        </CardContent>

        <CardActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
          <Button
            size="small"
            color="primary"
            fullWidth
            endIcon={<ArrowForwardIcon sx={{ fontSize: "1rem !important" }} />}
            sx={{
              borderRadius: "12px",
              py: 1,
              fontWeight: 600,
              color: "primary.main",
              bgcolor: "rgba(212, 175, 55, 0.06)",
              border: "1px solid rgba(212, 175, 55, 0.12)",
              transition: "all 0.25s ease",
              "&:hover": {
                bgcolor: "rgba(212, 175, 55, 0.12)",
                borderColor: "rgba(212, 175, 55, 0.25)",
              },
            }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/campaigns/${campaign.id}`);
            }}
          >
            Entrar na Campanha
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
