"use client";

import useCreateDocument from "@/lib/hooks/useCreateDocument";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

const DocSchema = z.object({
  title: z.string().min(3, "O título precisa ter pelo menos 3 caracteres"),
});

type DocFormData = z.infer<typeof DocSchema>;

interface CreateDocModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onSuccessCallback?: () => void;
}

export default function CreateDocModal({
  isModalOpen,
  setIsModalOpen,
  onSuccessCallback,
}: CreateDocModalProps) {
  const docMutation = useCreateDocument();
  const params = useParams();
  const campaignId = params.id as string;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DocFormData>();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = async (data: DocFormData) => {
    docMutation.mutate(
      {
        campaignId: campaignId,
        title: data.title,
        content: {},
        folderId: "",
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
          Novo Documento
        </Typography>
        <Typography
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
          Criar Documento
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
            {...register("title")}
            error={!!errors.title}
            helperText={errors.title?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                bgcolor: "rgba(13, 17, 23, 0.4)",
              },
            }}
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
            disabled={docMutation.isPending}
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
            Criar Documento
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
