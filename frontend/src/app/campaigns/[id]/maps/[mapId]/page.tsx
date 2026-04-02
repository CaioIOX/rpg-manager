"use client";

import useGetMap from "@/lib/hooks/useGetMap";
import useDocuments from "@/lib/hooks/useDocuments";
import useSyncMapMarkers from "@/lib/hooks/useSyncMapMarkers";
import { GetImageURL } from "@/lib/api/maps";
import { MapMarker } from "@/lib/types/Map";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import MapCanvas from "../_components/MapCanvas";

export default function MapViewerPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const campaignId = params.id as string;
  const mapId = params.mapId as string;

  const { data: mapDetail, isLoading } = useGetMap(campaignId, mapId);
  const { data: documents = [] } = useDocuments(campaignId);
  const syncMarkers = useSyncMapMarkers();

  const [localMarkers, setLocalMarkers] = useState<MapMarker[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Dialog state for navigation guard
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const pendingNavRef = useRef<(() => void) | null>(null);

  // Sync local markers from server data
  useEffect(() => {
    if (mapDetail?.markers) {
      setLocalMarkers(mapDetail.markers);
      setHasUnsavedChanges(false);
    }
  }, [mapDetail?.markers]);

  const handleMarkersChange = useCallback((newMarkers: MapMarker[]) => {
    setLocalMarkers(newMarkers);
    setHasUnsavedChanges(true);
  }, []);

  // Build the markers payload from a given list
  const buildPayload = (markers: MapMarker[]) =>
    markers.map((m) => ({
      pos_x: m.pos_x,
      pos_y: m.pos_y,
      label: m.label,
      document_id: m.document_id,
    }));

  // Manual save (toolbar button)
  const handleSave = useCallback(() => {
    syncMarkers.mutate(
      { campaignId, mapId, markers: buildPayload(localMarkers) },
      {
        onSuccess: () => {
          setHasUnsavedChanges(false);
          queryClient.invalidateQueries({ queryKey: ["map", campaignId, mapId] });
        },
      },
    );
  }, [campaignId, mapId, localMarkers, syncMarkers, queryClient]);

  // Auto-save with the freshly computed markers list (avoids stale state)
  const handleAutoSave = useCallback(
    (markers: MapMarker[]) => {
      syncMarkers.mutate(
        { campaignId, mapId, markers: buildPayload(markers) },
        {
          onSuccess: () => {
            setHasUnsavedChanges(false);
            queryClient.invalidateQueries({
              queryKey: ["map", campaignId, mapId],
            });
          },
        },
      );
    },
    [campaignId, mapId, syncMarkers, queryClient],
  );

  // ── Navigation guard ────────────────────────────────────────
  // Intercept Next.js client-side navigation (history.pushState)
  // so we can warn the user if they have unsaved markers.
  const hasUnsavedRef = useRef(hasUnsavedChanges);
  useEffect(() => {
    hasUnsavedRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const originalPushState = window.history.pushState.bind(window.history);

    window.history.pushState = function (
      state: unknown,
      title: string,
      url?: string | URL | null,
    ) {
      if (hasUnsavedRef.current) {
        // Store the navigation and ask for confirmation
        pendingNavRef.current = () => originalPushState(state, title, url);
        setShowLeaveDialog(true);
        return;
      }
      originalPushState(state, title, url);
    };

    return () => {
      window.history.pushState = originalPushState;
    };
  }, []); // Set up once — uses ref for the guard flag

  // Browser tab close / refresh guard
  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasUnsavedChanges]);

  // ── Navigation guard actions ────────────────────────────────
  const handleLeaveWithoutSaving = () => {
    setHasUnsavedChanges(false);
    setShowLeaveDialog(false);
    // Execute the intercepted navigation
    pendingNavRef.current?.();
    pendingNavRef.current = null;
  };

  const handleSaveAndLeave = () => {
    syncMarkers.mutate(
      { campaignId, mapId, markers: buildPayload(localMarkers) },
      {
        onSuccess: () => {
          setHasUnsavedChanges(false);
          setShowLeaveDialog(false);
          pendingNavRef.current?.();
          pendingNavRef.current = null;
        },
      },
    );
  };

  const handleCancelLeave = () => {
    setShowLeaveDialog(false);
    pendingNavRef.current = null;
  };

  // ── Back button ─────────────────────────────────────────────
  // Goes through history.pushState so the guard above fires if needed
  const handleBack = () => {
    router.push(`/campaigns/${campaignId}/maps`);
  };

  const imageUrl = GetImageURL(campaignId, mapId);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 64px)",
        }}
      >
        <Skeleton
          variant="rounded"
          width="80%"
          height="80%"
          sx={{ borderRadius: "16px", bgcolor: "rgba(22, 27, 34, 0.5)" }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 64px)",
        overflow: "hidden",
      }}
    >
      {/* Header bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1,
          borderBottom: "1px solid rgba(212, 175, 55, 0.06)",
          bgcolor: "rgba(13, 17, 23, 0.5)",
          backdropFilter: "blur(12px)",
          minHeight: 48,
          flexShrink: 0,
        }}
      >
        <IconButton
          size="small"
          onClick={handleBack}
          sx={{
            color: "text.secondary",
            "&:hover": {
              color: "#D4AF37",
              bgcolor: "rgba(212, 175, 55, 0.08)",
            },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: "1.1rem" }} />
        </IconButton>

        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#E6E6E6",
            flex: 1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {mapDetail?.name || "Mapa"}
        </Typography>

        {hasUnsavedChanges && (
          <Typography
            sx={{
              fontSize: "0.7rem",
              color: "#D4AF37",
              fontWeight: 500,
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.5 },
              },
            }}
          >
            Alterações não salvas
          </Typography>
        )}

        <Typography
          variant="caption"
          sx={{ color: "text.disabled", fontSize: "0.7rem" }}
        >
          {localMarkers.length} marcador{localMarkers.length !== 1 ? "es" : ""}
        </Typography>
      </Box>

      {/* Map canvas */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <MapCanvas
          imageUrl={imageUrl}
          markers={localMarkers}
          documents={documents}
          onMarkersChange={handleMarkersChange}
          onAutoSave={handleAutoSave}
          onSave={handleSave}
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={syncMarkers.isPending}
        />
      </Box>

      {/* Unsaved changes navigation guard dialog */}
      <Dialog
        open={showLeaveDialog}
        onClose={handleCancelLeave}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "background.paper",
              borderRadius: "20px",
              border: "1px solid rgba(212, 175, 55, 0.12)",
              boxShadow:
                "0 24px 48px rgba(0, 0, 0, 0.5), 0 0 60px rgba(212, 175, 55, 0.04)",
              maxWidth: 400,
              width: "calc(100% - 32px)",
            },
          },
        }}
      >
        <DialogTitle sx={{ pt: 3, px: 3, pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <WarningAmberIcon
              sx={{ color: "#D4AF37", fontSize: "1.5rem", flexShrink: 0 }}
            />
            <Box>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontSize: "0.8rem", mb: 0.25 }}
              >
                Marcadores não salvos
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  background:
                    "linear-gradient(135deg, #D4AF37 0%, #E8CC6E 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Sair sem salvar?
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: 1, pb: 2 }}>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontSize: "0.88rem", lineHeight: 1.6 }}
          >
            Você tem marcadores que ainda não foram salvos. Se sair agora, as
            alterações serão perdidas.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
            pt: 0,
            gap: 1,
            flexDirection: { xs: "column-reverse", sm: "row" },
          }}
        >
          <Button
            onClick={handleCancelLeave}
            variant="text"
            sx={{
              color: "text.secondary",
              borderRadius: "10px",
              px: 2,
              width: { xs: "100%", sm: "auto" },
              "&:hover": { bgcolor: "rgba(255,255,255,0.04)" },
            }}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleLeaveWithoutSaving}
            variant="outlined"
            sx={{
              borderRadius: "10px",
              px: 2,
              width: { xs: "100%", sm: "auto" },
              borderColor: "rgba(248, 81, 73, 0.4)",
              color: "#F85149",
              "&:hover": {
                borderColor: "#F85149",
                bgcolor: "rgba(248, 81, 73, 0.08)",
              },
            }}
          >
            Sair sem salvar
          </Button>

          <Button
            onClick={handleSaveAndLeave}
            variant="contained"
            disabled={syncMarkers.isPending}
            sx={{
              borderRadius: "10px",
              px: 2.5,
              width: { xs: "100%", sm: "auto" },
              background: "linear-gradient(135deg, #D4AF37 0%, #9E8024 100%)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #E8CC6E 0%, #D4AF37 100%)",
              },
            }}
          >
            Salvar e sair
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
