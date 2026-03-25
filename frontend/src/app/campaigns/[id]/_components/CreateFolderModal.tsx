"use client";

import useCreateFolder from "@/lib/hooks/useCreateFolder";
import useUpdateFolder from "@/lib/hooks/useUpdateFolder";
import useFolders from "@/lib/hooks/useFolders";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Folder } from "@/lib/types/Folder";

const folderSchema = z.object({
  name: z.string().min(1, "O nome da pasta é obrigatório"),
  parentId: z.string().optional(),
});

type FormData = z.infer<typeof folderSchema>;

interface CreateFolderModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  initialData?: Folder;
}

export default function CreateFolderModal({
  isModalOpen,
  setIsModalOpen,
  initialData,
}: CreateFolderModalProps) {
  const folderMutation = useCreateFolder();
  const folderUpdateMutation = useUpdateFolder();
  const params = useParams();
  const campaignId = params.id as string;
  const queryClient = useQueryClient();
  const { data: folders } = useFolders(campaignId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: initialData?.name || "",
      parentId: initialData?.parent_id || "",
    },
    resolver: zodResolver(folderSchema),
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  useEffect(() => {
    if (initialData && isModalOpen) {
      reset({
        name: initialData.name,
        parentId: initialData.parent_id || "",
      });
    }
  }, [initialData, isModalOpen, reset]);

  const onSubmit = async (data: FormData) => {
    if (initialData) {
      folderUpdateMutation.mutate(
        {
          campaignId,
          folderId: initialData.id,
          name: data.name,
          parentId: data.parentId || undefined,
        },
        {
          onSuccess: () => {
            handleCloseModal();
            queryClient.invalidateQueries({ queryKey: ["folders", campaignId] });
          },
        },
      );
    } else {
      folderMutation.mutate(
        {
          campaignId,
          name: data.name,
          parentId: data.parentId || undefined,
        },
        {
          onSuccess: () => {
            handleCloseModal();
            queryClient.invalidateQueries({ queryKey: ["folders", campaignId] });
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
          {initialData ? "Editar Pasta" : "Nova Pasta"}
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
          {initialData ? "Editar Pasta" : "Criar Pasta"}
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
            label="Nome da pasta"
            placeholder="Ex: Personagens"
            fullWidth
            variant="outlined"
            {...register("name", {
              required: "O nome da pasta é obrigatório",
              minLength: { value: 1, message: "Nome muito curto" },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                bgcolor: "rgba(13, 17, 23, 0.4)",
              },
            }}
          />

          <TextField
            label="Pasta pai (opcional)"
            select
            fullWidth
            variant="outlined"
            defaultValue=""
            {...register("parentId")}
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
                {folder.name}
              </MenuItem>
            ))}
          </TextField>
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
            disabled={folderMutation.isPending || folderUpdateMutation.isPending}
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
            {initialData ? "Salvar Alterações" : "Criar Pasta"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
