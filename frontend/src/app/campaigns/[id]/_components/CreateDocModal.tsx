"use client";

import useCreateDocument from "@/lib/hooks/useCreateDocument";
import useUpdateDocument from "@/lib/hooks/useUpdateDocument";
import useFolders from "@/lib/hooks/useFolders";
import useTemplates from "@/lib/hooks/useTemplates";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DocumentSummary } from "@/lib/types/Documents";

const docSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  folderId: z.string().optional(),
  templateId: z.string().optional(),
  isSpoiler: z.boolean(),
});

type DocFormData = z.infer<typeof docSchema>;

interface CreateDocModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onSuccessCallback?: () => void;
  defaultFolderId?: string;
  initialData?: DocumentSummary;
}

export default function CreateDocModal({
  isModalOpen,
  setIsModalOpen,
  onSuccessCallback,
  defaultFolderId,
  initialData,
}: CreateDocModalProps) {
  const docMutation = useCreateDocument();
  const docUpdateMutation = useUpdateDocument();
  const params = useParams();
  const campaignId = params.id as string;
  const queryClient = useQueryClient();
  const { data: folders } = useFolders(campaignId);
  const { data: templates } = useTemplates(campaignId);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<DocFormData>({
    defaultValues: {
      title: initialData?.title || "",
      folderId: initialData?.folderID || defaultFolderId || "",
      templateId: "", // Cannot change template after creation
      isSpoiler: initialData?.isSpoiler || false,
    },
    resolver: zodResolver(docSchema),
  });

  const isSpoiler = watch("isSpoiler");

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  useEffect(() => {
    if (initialData && isModalOpen) {
      reset({
        title: initialData.title,
        folderId: initialData.folderID || defaultFolderId || "",
        templateId: "", // Cannot change template after creation
        isSpoiler: initialData.isSpoiler || false,
      });
    }
  }, [initialData, isModalOpen, defaultFolderId, reset]);

  const onSubmit = async (data: DocFormData) => {
    if (initialData) {
      docUpdateMutation.mutate(
        {
          campaignId,
          documentId: initialData.id,
          title: data.title,
          folderID: data.folderId || undefined,
          isSpoiler: data.isSpoiler,
        },
        {
          onSuccess: () => {
            handleCloseModal();
            queryClient.invalidateQueries({
              queryKey: ["documents", campaignId],
            });
            if (onSuccessCallback) {
              onSuccessCallback();
            }
          },
        },
      );
    } else {
      docMutation.mutate(
        {
          campaignId,
          title: data.title,
          folderId: data.folderId || undefined,
          templateId: data.templateId || undefined,
          isSpoiler: data.isSpoiler,
        },
        {
          onSuccess: () => {
            handleCloseModal();
            queryClient.invalidateQueries({
              queryKey: ["documents", campaignId],
            });
            if (onSuccessCallback) {
              onSuccessCallback();
            }
          },
        },
      );
    }
  };

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleCloseModal}
      slotProps={{
        paper: {
          sx: {
            bgcolor: "background.paper",
            borderRadius: "24px",
            minWidth: { xs: "90%", sm: "440px" },
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
          {initialData ? "Editar Documento" : "Novo Documento"}
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
          {initialData ? "Editar Documento" : "Criar Documento"}
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            px: 3,
            pt: 2,
          }}
        >
          <TextField
            label="Título do documento"
            placeholder="Aventura dos amigos"
            fullWidth
            variant="outlined"
            {...register("title", {
              required: "O título é obrigatório",
              minLength: {
                value: 3,
                message: "O título precisa ter pelo menos 3 caracteres",
              },
            })}
            error={!!errors.title}
            helperText={errors.title?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                bgcolor: "rgba(13, 17, 23, 0.4)",
              },
            }}
          />

          <TextField
            label="Pasta (opcional)"
            select
            fullWidth
            variant="outlined"
            defaultValue={defaultFolderId || ""}
            {...register("folderId")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                bgcolor: "rgba(13, 17, 23, 0.4)",
              },
            }}
          >
            <MenuItem value="">Nenhuma (raiz)</MenuItem>
            {folders?.map((folder) => (
              <MenuItem key={folder.id} value={folder.id}>
                📁 {folder.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Template (opcional)"
            select
            fullWidth
            variant="outlined"
            defaultValue=""
            {...register("templateId")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                bgcolor: "rgba(13, 17, 23, 0.4)",
              },
            }}
          >
            <MenuItem value="">Nenhum</MenuItem>
            {templates?.map((template) => (
              <MenuItem key={template.id} value={template.id}>
                {template.icon} {template.name}
              </MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            control={
              <Switch
                {...register("isSpoiler")}
                checked={isSpoiler}
                sx={{
                  "& .Mui-checked": { color: "#F85149" },
                  "& .Mui-checked + .MuiSwitch-track": {
                    bgcolor: "rgba(248, 81, 73, 0.5)",
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                🔒 Spoiler — Apenas você e o dono da campanha podem ver
              </Typography>
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button
            onClick={handleCloseModal}
            variant="text"
            sx={{
              color: "text.secondary",
              borderRadius: "12px",
              px: 2.5,
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.04)",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={docMutation.isPending || docUpdateMutation.isPending}
            sx={{
              borderRadius: "12px",
              px: 3,
              background:
                "linear-gradient(135deg, #D4AF37 0%, #9E8024 100%)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #E8CC6E 0%, #D4AF37 100%)",
              },
            }}
          >
            {initialData ? "Salvar Alterações" : "Criar Documento"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
