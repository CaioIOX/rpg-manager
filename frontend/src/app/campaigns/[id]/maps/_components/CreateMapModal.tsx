"use client";

import useCreateMap from "@/lib/hooks/useCreateMap";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateMapModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const MAX_FILE_SIZE_FREE = 25 * 1024 * 1024; // 25MB
const MAX_FILE_SIZE_PREMIUM = 50 * 1024 * 1024; // 50MB

export default function CreateMapModal({
  isModalOpen,
  setIsModalOpen,
}: CreateMapModalProps) {
  const createMap = useCreateMap();
  const { data: currentUser } = useCurrentUser();
  const params = useParams();
  const campaignId = params.id as string;
  const queryClient = useQueryClient();

  const isPremium = !!currentUser?.is_premium;
  const maxFileSize = isPremium ? MAX_FILE_SIZE_PREMIUM : MAX_FILE_SIZE_FREE;
  const maxFileSizeMB = isPremium ? 50 : 25;

  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setIsModalOpen(false);
    setName("");
    setFile(null);
    setPreview(null);
    setProgress(0);
  };

  useEffect(() => {
    if (!isModalOpen) return;
    setName("");
    setFile(null);
    setPreview(null);
    setProgress(0);
  }, [isModalOpen]);

  const processFile = useCallback(
    (f: File) => {
      if (!f.type.startsWith("image/")) {
        toast.error("Apenas imagens são aceitas (PNG, JPEG, GIF, WebP).");
        return;
      }
      if (f.size > maxFileSize) {
        if (isPremium) {
          toast.error(`O arquivo é muito grande. O limite para premium é ${maxFileSizeMB}MB.`);
        } else {
          toast.error(
            `O arquivo é muito grande (${(f.size / 1024 / 1024).toFixed(1)}MB). Limite: 25MB. Usuários premium podem enviar até 50MB!`,
          );
        }
        return;
      }
      setFile(f);
      setPreview(URL.createObjectURL(f));
      if (!name) {
        setName(f.name.replace(/\.[^/.]+$/, ""));
      }
    },
    [name, maxFileSize, isPremium, maxFileSizeMB],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) processFile(f);
    },
    [processFile],
  );

  const handleSubmit = () => {
    if (!file || !name.trim()) return;

    createMap.mutate(
      {
        campaignId,
        name: name.trim(),
        file,
        onProgress: setProgress,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["maps", campaignId] });
          queryClient.invalidateQueries({ queryKey: ["currentUser"] });
          handleClose();
        },
      },
    );
  };

  const fileSizeMB = file ? (file.size / 1024 / 1024).toFixed(1) : "0";

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            bgcolor: "background.paper",
            borderRadius: { xs: "20px", md: "24px" },
            width: { xs: "calc(100% - 24px)", sm: "500px" },
            maxWidth: "500px",
            border: "1px solid rgba(212, 175, 55, 0.12)",
            boxShadow:
              "0 24px 48px rgba(0, 0, 0, 0.5), 0 0 80px rgba(212, 175, 55, 0.04)",
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 0.5, fontSize: "0.8rem" }}
        >
          Novo Mapa
        </Typography>
        <Typography
          component="span"
          variant="h5"
          sx={{
            fontFamily: '"Merriweather", "Georgia", serif',
            fontWeight: 700,
            background: "linear-gradient(135deg, #D4AF37 0%, #E8CC6E 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Upload de Mapa
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          px: { xs: 2, sm: 3 },
          pt: 2,
        }}
      >
        <TextField
          label="Nome do mapa"
          placeholder="Mapa da Cidade Imperial"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              bgcolor: "rgba(13, 17, 23, 0.4)",
            },
          }}
        />

        {/* Drop zone */}
        <Box
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            border: "2px dashed",
            borderColor: isDragging
              ? "primary.main"
              : file
                ? "rgba(212, 175, 55, 0.3)"
                : "rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 180,
            cursor: "pointer",
            transition: "all 0.25s ease",
            bgcolor: isDragging
              ? "rgba(212, 175, 55, 0.06)"
              : "rgba(13, 17, 23, 0.3)",
            "&:hover": {
              borderColor: "rgba(212, 175, 55, 0.4)",
              bgcolor: "rgba(212, 175, 55, 0.04)",
            },
            overflow: "hidden",
            position: "relative",
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) processFile(f);
            }}
          />

          {preview ? (
            <>
              <Box
                component="img"
                src={preview}
                alt="Preview"
                sx={{
                  maxWidth: "100%",
                  maxHeight: 200,
                  borderRadius: "8px",
                  objectFit: "contain",
                  mb: 1.5,
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontSize: "0.8rem" }}
              >
                {file?.name} — {fileSizeMB} MB
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "primary.main",
                  fontSize: "0.7rem",
                  mt: 0.5,
                }}
              >
                Clique para trocar a imagem
              </Typography>
            </>
          ) : (
            <>
              <CloudUploadIcon
                sx={{
                  fontSize: 48,
                  color: isDragging
                    ? "primary.main"
                    : "rgba(255, 255, 255, 0.15)",
                  mb: 1.5,
                  transition: "color 0.2s",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  textAlign: "center",
                  fontSize: "0.85rem",
                }}
              >
                Arraste e solte uma imagem aqui
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.disabled",
                  mt: 0.5,
                  textAlign: "center",
                }}
              >
                ou clique para selecionar • Máximo {maxFileSizeMB}MB
                {!isPremium && (
                  <Box
                    component="span"
                    sx={{ color: "primary.main", ml: 0.5 }}
                  >
                    (Premium: 50MB)
                  </Box>
                )}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1.5 }}>
                <ImageIcon
                  sx={{ fontSize: 16, color: "rgba(255,255,255,0.2)" }}
                />
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(255,255,255,0.25)", fontSize: "0.7rem" }}
                >
                  PNG, JPEG, GIF, WebP
                </Typography>
              </Box>
            </>
          )}
        </Box>

        {/* Upload progress */}
        {createMap.isPending && progress > 0 && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                borderRadius: "8px",
                height: 6,
                bgcolor: "rgba(212, 175, 55, 0.1)",
                "& .MuiLinearProgress-bar": {
                  background:
                    "linear-gradient(90deg, #D4AF37 0%, #E8CC6E 100%)",
                  borderRadius: "8px",
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                mt: 0.5,
                display: "block",
                textAlign: "center",
              }}
            >
              Enviando… {progress}%
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: { xs: 2, sm: 3 },
          pb: { xs: 2, sm: 3 },
          pt: 1,
          gap: 1,
          flexDirection: { xs: "column-reverse", sm: "row" },
        }}
      >
        <Button
          onClick={handleClose}
          variant="text"
          sx={{
            color: "text.secondary",
            borderRadius: "12px",
            px: 2.5,
            width: { xs: "100%", sm: "auto" },
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.04)",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!file || !name.trim() || createMap.isPending}
          sx={{
            borderRadius: "12px",
            px: 3,
            width: { xs: "100%", sm: "auto" },
            background: "linear-gradient(135deg, #D4AF37 0%, #9E8024 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #E8CC6E 0%, #D4AF37 100%)",
            },
          }}
        >
          Criar Mapa
        </Button>
      </DialogActions>
    </Dialog>
  );
}
