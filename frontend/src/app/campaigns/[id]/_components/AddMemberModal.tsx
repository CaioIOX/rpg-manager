"use client";

import useAddMember from "@/lib/hooks/useAddMember";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const memberSchema = z.object({
  email: z.string().min(1, "O email é obrigatório").email("Email inválido"),
  role: z.string().min(1, "O papel é obrigatório"),
});

type FormData = z.infer<typeof memberSchema>;

interface AddMemberModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export default function AddMemberModal({
  isModalOpen,
  setIsModalOpen,
}: AddMemberModalProps) {
  const memberMutation = useAddMember();
  const params = useParams();
  const campaignId = params.id as string;
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { role: "editor" },
    resolver: zodResolver(memberSchema),
  });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    memberMutation.mutate(
      {
        campaignId,
        email: data.email,
        role: data.role,
      },
      {
        onSuccess: () => {
          handleCloseModal();
          queryClient.invalidateQueries({
            queryKey: ["campaign", campaignId],
          });
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
      <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 0.5, fontSize: "0.8rem" }}
        >
          Gerenciar Equipe
        </Typography>
        <Typography
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
          Adicionar Membro
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
            label="Email do jogador"
            placeholder="jogador@email.com"
            fullWidth
            variant="outlined"
            type="email"
            {...register("email", {
              required: "O email é obrigatório",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email inválido",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                bgcolor: "rgba(13, 17, 23, 0.4)",
              },
            }}
          />

          <TextField
            label="Papel na campanha"
            select
            fullWidth
            variant="outlined"
            defaultValue="editor"
            {...register("role")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                bgcolor: "rgba(13, 17, 23, 0.4)",
              },
            }}
          >
            <MenuItem value="editor">Editor — Pode criar e editar</MenuItem>
            <MenuItem value="viewer">Visualizador — Apenas leitura</MenuItem>
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
            disabled={memberMutation.isPending}
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
            Adicionar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
