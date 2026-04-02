"use client";

import { MapMarker } from "@/lib/types/Map";
import { DocumentSummary } from "@/lib/types/Documents";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";

interface MarkerEditorProps {
  marker: Partial<MapMarker> | null;
  anchorPosition: { top: number; left: number } | null;
  documents: DocumentSummary[];
  onSave: (marker: Omit<MapMarker, "id" | "map_id" | "created_at">) => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function MarkerEditor({
  marker,
  anchorPosition,
  documents,
  onSave,
  onDelete,
  onClose,
}: MarkerEditorProps) {
  const [label, setLabel] = useState("");
  const [documentId, setDocumentId] = useState("");

  useEffect(() => {
    if (marker) {
      setLabel(marker.label || "");
      setDocumentId(marker.document_id || "");
    }
  }, [marker]);

  if (!marker || !anchorPosition) return null;

  const handleSave = () => {
    onSave({
      pos_x: marker.pos_x!,
      pos_y: marker.pos_y!,
      label: label.trim() || undefined,
      document_id: documentId || undefined,
    });
  };

  return (
    <Popover
      open={!!marker}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      slotProps={{
        paper: {
          sx: {
            bgcolor: "background.paper",
            border: "1px solid rgba(212, 175, 55, 0.15)",
            borderRadius: "16px",
            p: 2,
            width: 300,
            boxShadow:
              "0 16px 32px rgba(0, 0, 0, 0.5), 0 0 60px rgba(212, 175, 55, 0.03)",
          },
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #D4AF37 0%, #E8CC6E 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "0.85rem",
            }}
          >
            Editar Marcador
          </Typography>
          {marker.id && (
            <IconButton
              size="small"
              onClick={onDelete}
              sx={{
                color: "error.main",
                "&:hover": { bgcolor: "rgba(248, 81, 73, 0.08)" },
              }}
            >
              <DeleteIcon sx={{ fontSize: "1rem" }} />
            </IconButton>
          )}
        </Box>

        <TextField
          label="Observação"
          placeholder="Nome do local ou nota"
          size="small"
          fullWidth
          value={label}
          onChange={(e) => setLabel(e.target.value.slice(0, 100))}
          inputProps={{ maxLength: 100 }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              bgcolor: "rgba(13, 17, 23, 0.4)",
              fontSize: "0.85rem",
            },
          }}
        />

        <TextField
          label="Documento vinculado (opcional)"
          select
          size="small"
          fullWidth
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
          slotProps={{
            select: {
              MenuProps: {
                PaperProps: {
                  sx: { maxHeight: 200 },
                },
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              bgcolor: "rgba(13, 17, 23, 0.4)",
              fontSize: "0.85rem",
            },
          }}
        >
          <MenuItem value="">Nenhum</MenuItem>
          {documents.map((doc) => (
            <MenuItem key={doc.id} value={doc.id}>
              📄 {doc.title}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button
            size="small"
            onClick={onClose}
            sx={{
              color: "text.secondary",
              borderRadius: "8px",
              fontSize: "0.8rem",
            }}
          >
            Cancelar
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleSave}
            disabled={!label.trim() && !documentId}
            sx={{
              borderRadius: "8px",
              fontSize: "0.8rem",
              background: "linear-gradient(135deg, #D4AF37 0%, #9E8024 100%)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #E8CC6E 0%, #D4AF37 100%)",
              },
            }}
          >
            Salvar
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}
