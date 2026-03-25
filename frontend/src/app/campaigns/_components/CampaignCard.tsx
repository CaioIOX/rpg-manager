"use client";

import { Campaign } from "@/lib/types/Campaign";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState, MouseEvent } from "react";

interface CampaignCardProps {
  campaign: Campaign;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function CampaignCard({ campaign, onEdit, onDelete }: CampaignCardProps) {
  const router = useRouter();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = (event?: MouseEvent<HTMLElement>) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    setMenuAnchor(null);
  };

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
            transform: { xs: "none", md: "translateY(-6px)" },
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
        <CardContent sx={{ flexGrow: 1, p: { xs: 2.25, md: 3 } }}>
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
              p: { xs: 1.2, md: 1.5 },
              borderRadius: { xs: "14px", md: "16px" },
              bgcolor: "rgba(212, 175, 55, 0.1)",
              color: "#D4AF37",
              mb: 2,
            }}
          >
            <AutoStoriesIcon sx={{ fontSize: { xs: 22, md: 24 } }} />
          </Box>
          
          {(onEdit || onDelete) && (
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{
                color: "text.secondary",
                ml: "auto",
                mt: -1,
                mr: -1,
                "&:hover": { color: "primary.main", bgcolor: "rgba(212, 175, 55, 0.1)" },
              }}
            >
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>

        <Typography
            variant="h6"
            component={"h2"}
            sx={{
              color: "text.primary",
              fontWeight: 700,
              mb: 1,
              lineHeight: 1.3,
              fontSize: { xs: "1rem", md: "1.25rem" },
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

        <CardActions
        sx={{
          justifyContent: "space-between",
          px: { xs: 2.25, md: 3 },
          pb: { xs: 2.25, md: 3 },
          pt: 0,
        }}
      >
        <Typography variant="caption" sx={{ color: "text.disabled" }}>
          Criado em {new Date(campaign.created_at).toLocaleDateString("pt-BR")}
        </Typography>
      </CardActions>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => handleMenuClose()}
        onClick={(e) => e.stopPropagation()}
        sx={{
          "& .MuiPaper-root": {
            bgcolor: "background.paper",
            border: "1px solid rgba(212, 175, 55, 0.12)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.5)",
            borderRadius: "8px",
          },
        }}
      >
        {onEdit && (
          <MenuItem
            onClick={(e) => {
              handleMenuClose(e);
              onEdit();
            }}
            sx={{ fontSize: "0.85rem" }}
          >
            Editar
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem
            onClick={(e) => {
              handleMenuClose(e);
              onDelete();
            }}
            sx={{ fontSize: "0.85rem", color: "error.main" }}
          >
            Apagar
          </MenuItem>
        )}
      </Menu>
    </Card>
  </Grid>
  );
}
