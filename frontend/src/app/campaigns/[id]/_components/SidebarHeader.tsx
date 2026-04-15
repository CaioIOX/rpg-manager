"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useLocale } from "@/lib/i18n";

interface SidebarHeaderProps {
  campaignName?: string;
  isMobile?: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onBack: () => void;
  onOpenCampaign: () => void;
  onOpenMembers: () => void;
}

export default function SidebarHeader({
  campaignName,
  isMobile = false,
  searchQuery,
  onSearchChange,
  onBack,
  onOpenCampaign,
  onOpenMembers,
}: SidebarHeaderProps) {
  const { t } = useLocale();

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderBottom: "1px solid",
        borderColor: "rgba(212, 175, 55, 0.08)",
        background:
          "linear-gradient(180deg, rgba(212, 175, 55, 0.04) 0%, transparent 100%)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <Box
          onClick={onBack}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            cursor: "pointer",
            px: 0.5,
            py: 0.5,
            borderRadius: "10px",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.04)",
              "& .back-arrow": {
                transform: "translateX(-2px)",
              },
            },
          }}
        >
          <IconButton
            aria-label={t.sidebar.back}
            size="small"
            className="back-arrow"
            sx={{
              color: "text.secondary",
              transition: "all 0.2s ease",
              "&:hover": { bgcolor: "transparent" },
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box
          onClick={onOpenCampaign}
          sx={{
            minWidth: 0,
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            px: 0.5,
            py: 0.5,
            borderRadius: "10px",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.04)",
            },
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontFamily: '"Merriweather", "Georgia", serif',
              color: "primary.main",
              fontWeight: 700,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: isMobile ? "100%" : "180px",
              textAlign: "center",
            }}
          >
            {campaignName || t.sidebar.campaign}
          </Typography>
        </Box>

        <Tooltip title={t.sidebar.addMember} arrow>
          <IconButton
            aria-label="Membros"
            size="small"
            onClick={onOpenMembers}
            sx={{
              color: "text.secondary",
              transition: "all 0.2s ease",
              "&:hover": {
                color: "primary.main",
                bgcolor: "rgba(212, 175, 55, 0.08)",
              },
            }}
          >
            <PersonIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <TextField
        placeholder={t.sidebar.searchPlaceholder}
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        fullWidth
        size="small"
        variant="outlined"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{ fontSize: "1.1rem", color: "text.secondary" }}
                />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            bgcolor: "rgba(13, 17, 23, 0.5)",
            fontSize: { xs: "0.95rem", sm: "0.875rem" },
            borderRadius: "12px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.06)",
            },
          },
        }}
      />
    </Box>
  );
}
