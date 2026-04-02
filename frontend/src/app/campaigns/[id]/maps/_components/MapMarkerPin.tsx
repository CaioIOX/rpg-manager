"use client";

import { MapMarker } from "@/lib/types/Map";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import PlaceIcon from "@mui/icons-material/Place";
import LinkIcon from "@mui/icons-material/Link";
import { useParams, useRouter } from "next/navigation";

interface MapMarkerPinProps {
  marker: MapMarker;
  scale: number;
  isSelected: boolean;
  onSelect: () => void;
  documentTitle?: string;
}

export default function MapMarkerPin({
  marker,
  scale,
  isSelected,
  onSelect,
  documentTitle,
}: MapMarkerPinProps) {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const hasDocument = !!marker.document_id;
  const label = marker.label || documentTitle || "Marcador";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasDocument && marker.document_id) {
      // Open document in new tab
      window.open(
        `/campaigns/${campaignId}/docs/${marker.document_id}`,
        "_blank",
      );
    } else {
      onSelect();
    }
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: "absolute",
        left: `${marker.pos_x}%`,
        top: `${marker.pos_y}%`,
        transform: `translate(-50%, -100%) scale(${1 / scale})`,
        transformOrigin: "bottom center",
        zIndex: isSelected ? 20 : 10,
        cursor: "pointer",
        transition: "filter 0.15s ease",
        "&:hover": {
          filter: "brightness(1.3)",
          zIndex: 25,
        },
      }}
    >
      <Tooltip
        title={
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.8rem", fontWeight: 600 }}>
              {label}
            </Typography>
            {hasDocument && (
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  color: "rgba(255,255,255,0.7)",
                  mt: 0.25,
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  justifyContent: "center",
                }}
              >
                <LinkIcon sx={{ fontSize: "0.7rem" }} />
                Clique para abrir documento
              </Typography>
            )}
          </Box>
        }
        arrow
        placement="top"
        slotProps={{
          tooltip: {
            sx: {
              bgcolor: "rgba(13, 17, 23, 0.95)",
              border: "1px solid rgba(212, 175, 55, 0.2)",
              borderRadius: "10px",
              px: 1.5,
              py: 0.75,
              backdropFilter: "blur(8px)",
            },
          },
          arrow: {
            sx: {
              color: "rgba(13, 17, 23, 0.95)",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
          }}
        >
          <PlaceIcon
            sx={{
              fontSize: 32,
              color: hasDocument ? "#D4AF37" : "#E06C75",
              filter: isSelected
                ? "drop-shadow(0 0 8px rgba(212, 175, 55, 0.6))"
                : "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
              transition: "all 0.2s ease",
            }}
          />
          {/* Label below the pin */}
          <Box
            sx={{
              bgcolor: "rgba(13, 17, 23, 0.85)",
              border: "1px solid",
              borderColor: hasDocument
                ? "rgba(212, 175, 55, 0.3)"
                : "rgba(224, 108, 117, 0.3)",
              borderRadius: "6px",
              px: 0.75,
              py: 0.25,
              mt: -0.5,
              maxWidth: 120,
              backdropFilter: "blur(4px)",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.6rem",
                fontWeight: 600,
                color: hasDocument ? "#D4AF37" : "#E6E6E6",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                lineHeight: 1.3,
              }}
            >
              {label}
            </Typography>
          </Box>
        </Box>
      </Tooltip>
    </Box>
  );
}
