"use client";

import useCreateTemplate from "@/lib/hooks/useCreateTemplate";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

interface SchemaField {
  name: string;
  type: string;
  label: string;
  required: boolean;
}

interface FormData {
  name: string;
  description: string;
  icon: string;
}

interface CreateTemplateModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const FIELD_TYPES = [
  { value: "text", label: "Texto curto" },
  { value: "textarea", label: "Texto longo" },
  { value: "number", label: "Número" },
  { value: "select", label: "Seleção" },
];

const ICON_OPTIONS = ["📄", "⚔️", "🛡️", "👤", "🏰", "🗺️", "💎", "🐉", "📜", "🧙"];

export default function CreateTemplateModal({
  isModalOpen,
  setIsModalOpen,
}: CreateTemplateModalProps) {
  const templateMutation = useCreateTemplate();
  const params = useParams();
  const campaignId = params.id as string;
  const queryClient = useQueryClient();

  const [fields, setFields] = useState<SchemaField[]>([]);
  const [newField, setNewField] = useState<SchemaField>({
    name: "",
    type: "text",
    label: "",
    required: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: { icon: "📄" } });

  const handleCloseModal = () => {
    setIsModalOpen(false);
    reset();
    setFields([]);
    setNewField({ name: "", type: "text", label: "", required: false });
  };

  const addField = () => {
    if (!newField.name || !newField.label) return;
    setFields([...fields, { ...newField }]);
    setNewField({ name: "", type: "text", label: "", required: false });
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    templateMutation.mutate(
      {
        campaignId,
        name: data.name,
        description: data.description,
        icon: data.icon,
        schema: fields as unknown as Record<string, unknown>,
      },
      {
        onSuccess: () => {
          handleCloseModal();
          queryClient.invalidateQueries({
            queryKey: ["templates", campaignId],
          });
        },
      },
    );
  };

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleCloseModal}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: "background.paper",
            borderRadius: "24px",
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
          Novo Template
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Merriweather", "Georgia", serif',
            fontWeight: 700,
            background: "linear-gradient(135deg, #BA68C8 0%, #8E24AA 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Criar Template
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            px: 3,
            pt: 2,
            maxHeight: "60vh",
            overflowY: "auto",
          }}
        >
          {/* Name */}
          <TextField
            label="Nome do template"
            placeholder="Ex: Ficha de Personagem"
            fullWidth
            variant="outlined"
            {...register("name", {
              required: "O nome é obrigatório",
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

          {/* Description */}
          <TextField
            label="Descrição (opcional)"
            placeholder="Descreva o propósito deste template"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            {...register("description")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                bgcolor: "rgba(13, 17, 23, 0.4)",
              },
            }}
          />

          {/* Icon */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                mb: 1,
                display: "block",
                fontWeight: 600,
              }}
            >
              Ícone
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {ICON_OPTIONS.map((icon) => (
                <Box key={icon}>
                  <input
                    type="radio"
                    id={`icon-${icon}`}
                    value={icon}
                    {...register("icon")}
                    style={{ display: "none" }}
                  />
                  <label htmlFor={`icon-${icon}`}>
                    <Chip
                      label={icon}
                      clickable
                      sx={{
                        fontSize: "1.2rem",
                        cursor: "pointer",
                        border: "1px solid rgba(255,255,255,0.08)",
                        "&:hover": {
                          borderColor: "rgba(142, 36, 170, 0.4)",
                        },
                      }}
                    />
                  </label>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Schema Builder */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                mb: 1.5,
                display: "block",
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "0.7rem",
                letterSpacing: "0.06em",
              }}
            >
              Campos do Template
            </Typography>

            {/* Existing fields */}
            <Stack spacing={1} sx={{ mb: 2 }}>
              {fields.map((field, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1.5,
                    borderRadius: "12px",
                    bgcolor: "rgba(142, 36, 170, 0.06)",
                    border: "1px solid rgba(142, 36, 170, 0.12)",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {field.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {field.name} •{" "}
                      {FIELD_TYPES.find((t) => t.value === field.type)?.label}
                      {field.required && " • Obrigatório"}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => removeField(index)}
                    sx={{
                      color: "error.main",
                      "&:hover": { bgcolor: "rgba(248, 81, 73, 0.08)" },
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Stack>

            {/* Add new field */}
            <Box
              sx={{
                p: 2,
                borderRadius: "14px",
                border: "1px dashed rgba(142, 36, 170, 0.2)",
                bgcolor: "rgba(13, 17, 23, 0.3)",
              }}
            >
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    label="Nome do campo"
                    placeholder="ex: nome"
                    size="small"
                    value={newField.name}
                    onChange={(e) =>
                      setNewField({ ...newField, name: e.target.value })
                    }
                    sx={{
                      flex: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        bgcolor: "rgba(13, 17, 23, 0.4)",
                      },
                    }}
                  />
                  <TextField
                    label="Rótulo"
                    placeholder="ex: Nome do Personagem"
                    size="small"
                    value={newField.label}
                    onChange={(e) =>
                      setNewField({ ...newField, label: e.target.value })
                    }
                    sx={{
                      flex: 1,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        bgcolor: "rgba(13, 17, 23, 0.4)",
                      },
                    }}
                  />
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    label="Tipo"
                    select
                    size="small"
                    value={newField.type}
                    onChange={(e) =>
                      setNewField({ ...newField, type: e.target.value })
                    }
                    sx={{
                      minWidth: 140,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                        bgcolor: "rgba(13, 17, 23, 0.4)",
                      },
                    }}
                  >
                    {FIELD_TYPES.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={newField.required}
                        onChange={(e) =>
                          setNewField({
                            ...newField,
                            required: e.target.checked,
                          })
                        }
                        sx={{
                          "& .Mui-checked": { color: "#BA68C8" },
                          "& .Mui-checked + .MuiSwitch-track": {
                            bgcolor: "rgba(142, 36, 170, 0.5)",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                        Obrigatório
                      </Typography>
                    }
                  />
                  <IconButton
                    onClick={addField}
                    disabled={!newField.name || !newField.label}
                    sx={{
                      color: "#BA68C8",
                      border: "1px solid rgba(142, 36, 170, 0.3)",
                      borderRadius: "10px",
                      "&:hover": { bgcolor: "rgba(142, 36, 170, 0.08)" },
                      "&.Mui-disabled": { opacity: 0.3 },
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1, gap: 1 }}>
          <Button
            onClick={handleCloseModal}
            variant="text"
            sx={{
              color: "text.secondary",
              borderRadius: "12px",
              px: 2.5,
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.04)" },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={templateMutation.isPending || fields.length === 0}
            sx={{
              borderRadius: "12px",
              px: 3,
              background:
                "linear-gradient(135deg, #BA68C8 0%, #8E24AA 100%)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #CE93D8 0%, #BA68C8 100%)",
              },
            }}
          >
            Criar Template
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
