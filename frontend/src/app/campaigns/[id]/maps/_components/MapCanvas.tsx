"use client";

import { MapMarker } from "@/lib/types/Map";
import { DocumentSummary } from "@/lib/types/Documents";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { useCallback, useRef, useState } from "react";
import MapMarkerPin from "./MapMarkerPin";
import MarkerEditor from "./MarkerEditor";
import MapToolbar from "./MapToolbar";

interface MapCanvasProps {
  imageUrl: string;
  markers: MapMarker[];
  documents: DocumentSummary[];
  onMarkersChange: (markers: MapMarker[]) => void;
  onAutoSave: (markers: MapMarker[]) => void;
  onSave: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
}

export default function MapCanvas({
  imageUrl,
  markers,
  documents,
  onMarkersChange,
  onAutoSave,
  onSave,
  hasUnsavedChanges,
  isSaving,
}: MapCanvasProps) {
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [showMarkers, setShowMarkers] = useState(true);
  const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<number | null>(
    null,
  );
  const [editingMarker, setEditingMarker] = useState<Partial<MapMarker> | null>(
    null,
  );
  const [editorAnchor, setEditorAnchor] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentScale, setCurrentScale] = useState(1);

  const handleImageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isAddingMarker) return;

      const container = imageContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scale = transformRef.current?.instance?.transformState?.scale || 1;

      // Calculate position relative to the image (in percentage)
      const posX = ((e.clientX - rect.left) / rect.width) * 100;
      const posY = ((e.clientY - rect.top) / rect.height) * 100;

      // Clamp to valid range
      const clampedX = Math.max(0, Math.min(100, posX));
      const clampedY = Math.max(0, Math.min(100, posY));

      const newMarker: Partial<MapMarker> = {
        pos_x: clampedX,
        pos_y: clampedY,
        label: "",
      };

      setEditingMarker(newMarker);
      setEditingIndex(null);
      setEditorAnchor({ top: e.clientY, left: e.clientX });
      setIsAddingMarker(false);
    },
    [isAddingMarker],
  );

  const handleMarkerSelect = useCallback(
    (index: number) => {
      const marker = markers[index];
      setSelectedMarkerIndex(index);
      setEditingMarker(marker);
      setEditingIndex(index);

      // Position the editor near the marker
      const container = imageContainerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        setEditorAnchor({
          top: rect.top + (marker.pos_y / 100) * rect.height,
          left: rect.left + (marker.pos_x / 100) * rect.width,
        });
      }
    },
    [markers],
  );

  const handleMarkerSave = useCallback(
    (saved: Omit<MapMarker, "id" | "map_id" | "created_at">) => {
      const updatedMarkers = [...markers];

      if (editingIndex !== null) {
        updatedMarkers[editingIndex] = {
          ...updatedMarkers[editingIndex],
          ...saved,
        };
      } else {
        updatedMarkers.push(saved as MapMarker);
      }

      onMarkersChange(updatedMarkers);
      onAutoSave(updatedMarkers); // auto-save immediately
      setEditingMarker(null);
      setEditorAnchor(null);
      setEditingIndex(null);
      setSelectedMarkerIndex(null);
    },
    [markers, editingIndex, onMarkersChange, onAutoSave],
  );

  const handleMarkerDelete = useCallback(() => {
    const updatedMarkers =
      editingIndex !== null
        ? markers.filter((_, i) => i !== editingIndex)
        : markers;
    onMarkersChange(updatedMarkers);
    onAutoSave(updatedMarkers); // auto-save on delete too
    setEditingMarker(null);
    setEditorAnchor(null);
    setEditingIndex(null);
    setSelectedMarkerIndex(null);
  }, [editingIndex, markers, onMarkersChange, onAutoSave]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        bgcolor: "#0D1117",
        overflow: "hidden",
        cursor: isAddingMarker ? "crosshair" : "default",
      }}
    >
      {/* Crosshair mode hint */}
      {isAddingMarker && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 30,
            bgcolor: "rgba(212, 175, 55, 0.15)",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            borderRadius: "10px",
            px: 2,
            py: 0.75,
            backdropFilter: "blur(8px)",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "#D4AF37",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Clique no mapa para adicionar um marcador
          </Typography>
        </Box>
      )}

      <TransformWrapper
        ref={transformRef}
        initialScale={1}
        minScale={0.2}
        maxScale={5}
        centerOnInit
        doubleClick={{ disabled: true }}
        panning={{ disabled: isAddingMarker }}
        onTransformed={(ref) => {
          setCurrentScale(ref.state.scale);
        }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <MapToolbar
              onZoomIn={() => zoomIn()}
              onZoomOut={() => zoomOut()}
              onReset={() => resetTransform()}
              isAddingMarker={isAddingMarker}
              onToggleAddMarker={() => setIsAddingMarker((prev) => !prev)}
              showMarkers={showMarkers}
              onToggleMarkers={() => setShowMarkers((prev) => !prev)}
              onSave={onSave}
              hasUnsavedChanges={hasUnsavedChanges}
              isSaving={isSaving}
            />

            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100%",
              }}
              contentStyle={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                ref={imageContainerRef}
                onClick={handleImageClick}
                sx={{
                  position: "relative",
                  display: "inline-block",
                  lineHeight: 0,
                }}
              >
                {/* Map image */}
                <Box
                  component="img"
                  src={imageUrl}
                  alt="Map"
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "calc(100vh - 64px)",
                    objectFit: "contain",
                    display: "block",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                />

                {/* Markers overlay */}
                {showMarkers &&
                  markers.map((marker, index) => {
                    const doc = marker.document_id
                      ? documents.find((d) => d.id === marker.document_id)
                      : undefined;
                    return (
                      <MapMarkerPin
                        key={marker.id || `new-${index}`}
                        marker={marker}
                        scale={currentScale}
                        isSelected={selectedMarkerIndex === index}
                        onSelect={() => handleMarkerSelect(index)}
                        documentTitle={doc?.title}
                      />
                    );
                  })}
              </Box>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Marker editor popover */}
      <MarkerEditor
        marker={editingMarker}
        anchorPosition={editorAnchor}
        documents={documents}
        onSave={handleMarkerSave}
        onDelete={handleMarkerDelete}
        onClose={() => {
          setEditingMarker(null);
          setEditorAnchor(null);
          setEditingIndex(null);
          setSelectedMarkerIndex(null);
        }}
      />
    </Box>
  );
}
