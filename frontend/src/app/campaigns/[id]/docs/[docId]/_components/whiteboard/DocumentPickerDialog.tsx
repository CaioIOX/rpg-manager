"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { DocumentSummary } from "@/lib/types/Documents";
import { useState } from "react";

interface DocumentPickerDialogProps {
  open: boolean;
  onClose: () => void;
  documents: DocumentSummary[];
  isLoading: boolean;
  onSelect: (doc: DocumentSummary) => void;
}

export default function DocumentPickerDialog({
  open,
  onClose,
  documents,
  isLoading,
  onSelect,
}: DocumentPickerDialogProps) {
  const [search, setSearch] = useState("");

  const filtered = documents.filter(
    (d) =>
      d.doc_type === "editor" &&
      d.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            bgcolor: "background.paper",
            borderRadius: "20px",
            width: { xs: "calc(100% - 24px)", sm: "440px" },
            maxWidth: "440px",
            border: "1px solid rgba(212, 175, 55, 0.12)",
            boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 2.5, px: 3 }}>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 0.5, fontSize: "0.8rem" }}
        >
          Adicionar à Lousa
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #D4AF37 0%, #E8CC6E 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Vincular Documento
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pt: 1, pb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Buscar documento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              bgcolor: "rgba(13,17,23,0.4)",
            },
          }}
        />

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} sx={{ color: "primary.main" }} />
          </Box>
        ) : filtered.length === 0 ? (
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", textAlign: "center", py: 3 }}
          >
            Nenhum documento encontrado
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            {filtered.map((doc) => (
              <Box
                key={doc.id}
                onClick={() => {
                  onSelect(doc);
                  onClose();
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  "&:hover": {
                    bgcolor: "rgba(212, 175, 55, 0.06)",
                    borderColor: "rgba(212, 175, 55, 0.3)",
                  },
                }}
              >
                <DescriptionOutlinedIcon
                  sx={{ fontSize: 18, color: "rgba(212, 175, 55, 0.7)" }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {doc.title}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
