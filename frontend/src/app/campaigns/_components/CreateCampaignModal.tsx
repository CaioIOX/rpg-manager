"use client";

import useCreateCampaign from "@/lib/hooks/useCreateCampaign";
import useUpdateCampaign from "@/lib/hooks/useUpdateCampaign";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Campaign } from "@/lib/types/Campaign";
import { useEffect } from "react";

const campaignSchema = z.object({
  name: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres"),
  description: z.string().optional(),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CreateCampaignModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onSuccessCallback?: () => void;
  initialData?: Campaign;
}

export default function CreateCampaignModal({
  isModalOpen,
  setIsModalOpen,
  onSuccessCallback,
  initialData,
}: CreateCampaignModalProps) {
  const campaignMutation = useCreateCampaign();
  const campaignUpdateMutation = useUpdateCampaign();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CampaignFormData>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
    resolver: zodResolver(campaignSchema),
  });

  useEffect(() => {
    if (initialData && isModalOpen) {
      reset({
        name: initialData.name,
        description: initialData.description || "",
      });
    } else if (!isModalOpen) {
      reset({ name: "", description: "" });
    }
  }, [initialData, isModalOpen, reset]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = async (data: CampaignFormData) => {
    if (initialData) {
      campaignUpdateMutation.mutate(
        {
          campaignId: initialData.id,
          name: data.name,
          description: data.description,
        },
        {
          onSuccess: () => {
            handleCloseModal();
            if (onSuccessCallback) {
              onSuccessCallback();
            }
          },
        },
      );
    } else {
      campaignMutation.mutate(
        {
          name: data.name,
          description: data.description,
        },
        {
          onSuccess: () => {
            handleCloseModal();
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
      <DialogTitle
        sx={{
          pb: 1,
          pt: 3,
          px: 3,
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 0.5, fontSize: "0.8rem" }}
        >
          {initialData ? "Editar Aventura" : "Nova Aventura"}
        </Typography>
        <Typography
          component="span"
          variant="h5"
          sx={{
            fontFamily: '"Merriweather", "Georgia", serif',
            fontWeight: 700,
            background:
              "linear-gradient(135deg, #D4AF37 0%, #E8CC6E 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {initialData ? "Reescrever Campanha" : "Forjar Nova Campanha"}
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
            label="Nome da campanha"
            placeholder="Aventura dos amigos"
            fullWidth
            variant="outlined"
            {...register("name")}
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
            label="Descrição"
            placeholder="Era uma vez alguns amigos que..."
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                bgcolor: "rgba(13, 17, 23, 0.4)",
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
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={campaignMutation.isPending || campaignUpdateMutation.isPending}
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
            {initialData ? "Salvar Alterações" : "Criar Campanha"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
