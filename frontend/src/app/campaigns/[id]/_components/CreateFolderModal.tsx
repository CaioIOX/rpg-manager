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
import { useLocale, getLocaleDict } from "@/lib/i18n";

const DEFAULT_FOLDER_COLOR = "#9E9E9E";

const folderSchema = z.object({
  name: z.string().min(1, { message: getLocaleDict().modals.nameRequired }),
  parentId: z.string().optional(),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6})$/, { message: getLocaleDict().modals.invalidHex })
    .optional(),
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
  const { t } = useLocale();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: initialData?.name || "",
      parentId: initialData?.parent_id || "",
      color: initialData?.color || DEFAULT_FOLDER_COLOR,
    },
    resolver: zodResolver(folderSchema),
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  useEffect(() => {
    if (isModalOpen) {
      if (initialData) {
        reset({
          name: initialData.name,
          parentId: initialData.parent_id || "",
          color: initialData.color || DEFAULT_FOLDER_COLOR,
        });
      } else {
        reset({
          name: "",
          parentId: "",
          color: DEFAULT_FOLDER_COLOR,
        });
      }
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
          color: data.color ?? DEFAULT_FOLDER_COLOR,
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
          color: data.color,
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
            borderRadius: { xs: "20px", md: "24px" },
            width: { xs: "calc(100% - 24px)", sm: "440px" },
            maxWidth: "440px",
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
          {initialData ? t.modals.editFolder : t.modals.newFolder}
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
          {initialData ? t.modals.editFolder : t.modals.createFolder}
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
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
            label={t.modals.folderName}
            placeholder={t.modals.folderPlaceholder}
            fullWidth
            variant="outlined"
            {...register("name", {
              required: t.modals.nameRequired,
              minLength: { value: 1, message: t.modals.nameMinLength },
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
            label={t.modals.folderParent}
            select
            fullWidth
            variant="outlined"
            {...register("parentId")}
            value={watch("parentId") || ""}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                bgcolor: "rgba(13, 17, 23, 0.4)",
              },
            }}
          >
            <MenuItem value="">{t.modals.noneRoot}</MenuItem>
            {folders?.map((folder) => (
              <MenuItem key={folder.id} value={folder.id}>
                {folder.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={t.modals.folderColor}
            type="color"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            {...register("color")}
            error={!!errors.color}
            helperText={
              errors.color?.message ?? t.modals.folderColorHelper
            }
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                bgcolor: "rgba(13, 17, 23, 0.4)",
              },
              "& .MuiInputBase-input": {
                padding: "8px",
              },
            }}
          />
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
            onClick={handleCloseModal}
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
            {t.modals.cancel}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={folderMutation.isPending || folderUpdateMutation.isPending}
            sx={{
              borderRadius: "12px",
              px: 3,
              width: { xs: "100%", sm: "auto" },
              background:
                "linear-gradient(135deg, #D4AF37 0%, #9E8024 100%)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #E8CC6E 0%, #D4AF37 100%)",
              },
            }}
          >
            {initialData ? t.modals.saveChanges : t.modals.createFolder}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
