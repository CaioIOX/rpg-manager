"use client";

import useCreateDocument from "@/lib/hooks/useCreateDocument";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
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
        content: content,
        folderId: folderId,
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
            borderRadius: "20px",
            minWidth: { xs: "90%", sm: "400px" },
            border: "1px solid",
            borderColor: "rgba(212, 175, 55, 0.2)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "primary.main",
          fontFamily: '"Merriweather", "Georgia", serif',
          fontWeight: "bold",
        }}
      >
        Forjar Nova Campanha
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            mt: 1,
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
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px" } }}
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
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px" } }}
          />
          <DialogActions
            sx={{
              p: 0,
              pt: 0,
            }}
          >
            <Button
              type="submit"
              variant={"contained"}
              color="primary"
              sx={{ borderRadius: "20px" }}
              disabled={docMutation.isPending}
            >
              Criar campanha
            </Button>
          </DialogActions>
        </DialogContent>
      </form>
    </Dialog>
  );
}
