"use client";

import { MapSummary } from "@/lib/types/Map";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import MapIcon from "@mui/icons-material/Map";
import { useParams, useRouter } from "next/navigation";

interface MapListCardProps {
  map: MapSummary;
  onDelete: (map: MapSummary) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function MapListCard({ map, onDelete }: MapListCardProps) {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  return (
    <Box
      onClick={() => router.push(`/campaigns/${campaignId}/maps/${map.id}`)}
      sx={{
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid rgba(212, 175, 55, 0.08)",
        bgcolor: "rgba(22, 27, 34, 0.6)",
        cursor: "pointer",
        transition: "all 0.25s ease",
        "&:hover": {
          border: "1px solid rgba(212, 175, 55, 0.2)",
          bgcolor: "rgba(22, 27, 34, 0.8)",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
          "& .map-delete": { opacity: 1 },
          "& .map-icon": {
            color: "#D4AF37",
            transform: "scale(1.1)",
          },
        },
      }}
    >
      {/* Preview area */}
      <Box
        sx={{
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgba(13, 17, 23, 0.8) 0%, rgba(22, 27, 34, 0.6) 100%)",
          borderBottom: "1px solid rgba(212, 175, 55, 0.06)",
        }}
      >
        <MapIcon
          className="map-icon"
          sx={{
            fontSize: 48,
            color: "rgba(212, 175, 55, 0.2)",
            transition: "all 0.3s ease",
          }}
        />
      </Box>

      {/* Info */}
      <Box sx={{ p: 2 }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "0.9rem",
            color: "#E6E6E6",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mb: 0.5,
          }}
        >
          {map.name}
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontSize: "0.75rem" }}
          >
            {formatSize(map.file_size)}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.disabled", fontSize: "0.7rem" }}
          >
            {map.width} × {map.height}
          </Typography>
        </Box>
      </Box>

      {/* Delete button */}
      <IconButton
        className="map-delete"
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(map);
        }}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          opacity: 0,
          transition: "opacity 0.2s",
          bgcolor: "rgba(13, 17, 23, 0.7)",
          backdropFilter: "blur(4px)",
          color: "error.main",
          "&:hover": {
            bgcolor: "rgba(248, 81, 73, 0.15)",
          },
        }}
      >
        <DeleteIcon sx={{ fontSize: "1rem" }} />
      </IconButton>
    </Box>
  );
}
