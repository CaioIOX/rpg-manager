"use client";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SaveIcon from "@mui/icons-material/Save";

interface MapToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  isAddingMarker: boolean;
  onToggleAddMarker: () => void;
  showMarkers: boolean;
  onToggleMarkers: () => void;
  onSave: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
}

const toolbarBtnSx = {
  color: "rgba(230, 230, 230, 0.7)",
  "&:hover": {
    color: "#D4AF37",
    bgcolor: "rgba(212, 175, 55, 0.1)",
  },
  transition: "all 0.15s ease",
};

export default function MapToolbar({
  onZoomIn,
  onZoomOut,
  onReset,
  isAddingMarker,
  onToggleAddMarker,
  showMarkers,
  onToggleMarkers,
  onSave,
  hasUnsavedChanges,
  isSaving,
}: MapToolbarProps) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        bgcolor: "rgba(13, 17, 23, 0.85)",
        border: "1px solid rgba(212, 175, 55, 0.12)",
        borderRadius: "14px",
        p: 0.5,
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
      }}
    >
      <Tooltip title="Zoom in" placement="left" arrow>
        <IconButton size="small" onClick={onZoomIn} sx={toolbarBtnSx}>
          <ZoomInIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Zoom out" placement="left" arrow>
        <IconButton size="small" onClick={onZoomOut} sx={toolbarBtnSx}>
          <ZoomOutIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Centralizar" placement="left" arrow>
        <IconButton size="small" onClick={onReset} sx={toolbarBtnSx}>
          <CenterFocusStrongIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>
      </Tooltip>

      <Divider
        sx={{ borderColor: "rgba(212, 175, 55, 0.1)", mx: 0.5 }}
      />

      <Tooltip
        title={isAddingMarker ? "Cancelar marcação" : "Adicionar marcador"}
        placement="left"
        arrow
      >
        <IconButton
          size="small"
          onClick={onToggleAddMarker}
          sx={{
            ...toolbarBtnSx,
            color: isAddingMarker ? "#D4AF37" : "rgba(230, 230, 230, 0.7)",
            bgcolor: isAddingMarker ? "rgba(212, 175, 55, 0.15)" : "transparent",
          }}
        >
          <AddLocationIcon sx={{ fontSize: "1.2rem" }} />
        </IconButton>
      </Tooltip>

      <Tooltip
        title={showMarkers ? "Ocultar marcadores" : "Mostrar marcadores"}
        placement="left"
        arrow
      >
        <IconButton
          size="small"
          onClick={onToggleMarkers}
          sx={toolbarBtnSx}
        >
          {showMarkers ? (
            <VisibilityIcon sx={{ fontSize: "1.2rem" }} />
          ) : (
            <VisibilityOffIcon sx={{ fontSize: "1.2rem" }} />
          )}
        </IconButton>
      </Tooltip>

      {hasUnsavedChanges && (
        <>
          <Divider
            sx={{ borderColor: "rgba(212, 175, 55, 0.1)", mx: 0.5 }}
          />
          <Tooltip title="Salvar marcadores" placement="left" arrow>
            <IconButton
              size="small"
              onClick={onSave}
              disabled={isSaving}
              sx={{
                ...toolbarBtnSx,
                color: "#D4AF37",
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.5 },
                },
              }}
            >
              <SaveIcon sx={{ fontSize: "1.2rem" }} />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  );
}
