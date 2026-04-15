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
import { useLocale, getLocaleDict } from "@/lib/i18n";

const docSchema = z.object({
  title: z.string().min(1, { message: getLocaleDict().modals.titleRequired }),
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
  const { t } = useLocale();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<DocFormData>({
    defaultValues: {
      title: initialData?.title || "",
      folderId: initialData?.folder_id || defaultFolderId || "",
      templateId: initialData?.template_id || "", // Cannot change template after creation
      isSpoiler: initialData?.is_spoiler || false,
    },
    resolver: zodResolver(docSchema),
  });

  const isSpoiler = watch("isSpoiler");

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  useEffect(() => {
    if (isModalOpen) {
      if (initialData) {
        reset({
          title: initialData.title,
          folderId: initialData.folder_id || defaultFolderId || "",
          templateId: initialData.template_id || "", // Cannot change template after creation
          isSpoiler: initialData.is_spoiler || false,
        });
      } else {
        reset({
          title: "",
          folderId: defaultFolderId || "",
          templateId: "",
          isSpoiler: false,
        });
      }
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
            queryClient.invalidateQueries({
              queryKey: ["currentUser"],
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
          {initialData ? t.modals.editDoc : t.modals.newDoc}
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
          {initialData ? t.modals.editDoc : t.modals.createDoc}
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
            label={t.modals.docTitleLabel}
            placeholder={t.modals.docTitlePlaceholder}
            fullWidth
            variant="outlined"
            {...register("title", {
              required: t.modals.titleRequired,
              minLength: {
                value: 3,
                message: t.modals.titleMinLength,
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
            label={t.modals.docFolder}
            select
            fullWidth
            variant="outlined"
            {...register("folderId")}
            slotProps={{
              select: {
                MenuProps: {
                  PaperProps: {
                    sx: { maxHeight: 250 },
                  },
                },
              },
            }}
            value={watch("folderId") || ""}
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
                📁 {folder.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={t.modals.docTemplate}
            select
            fullWidth
            variant="outlined"
            {...register("templateId")}
            slotProps={{
              select: {
                MenuProps: {
                  PaperProps: {
                    sx: { maxHeight: 250 },
                  },
                },
              },
            }}
            value={watch("templateId") || ""}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                bgcolor: "rgba(13, 17, 23, 0.4)",
              },
            }}
          >
            <MenuItem value="">{t.modals.noTemplate}</MenuItem>
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
                {t.modals.spoilerLabel}
              </Typography>
            }
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
            disabled={docMutation.isPending || docUpdateMutation.isPending}
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
            {initialData ? t.modals.saveChanges : t.modals.createDoc}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
