"use client";

import useCreateTemplate from "@/lib/hooks/useCreateTemplate";
import useUpdateTemplate from "@/lib/hooks/useUpdateTemplate";
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

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Template } from "@/lib/types/Template";
import { useEffect } from "react";
import { useLocale, getLocaleDict } from "@/lib/i18n";

interface SchemaField {
  name: string;
  type: string;
  label: string;
  options?: string[];
}

const templateSchema = z.object({
  name: z.string().min(1, { message: getLocaleDict().modals.nameRequired }),
  description: z.string().optional(),
  icon: z.string(),
});

type FormData = z.infer<typeof templateSchema>;

interface CreateTemplateModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  initialData?: Template;
}

const ICON_OPTIONS = [
  "📄", "⚔️", "🛡️", "👤", "🏰", "🗺️", "💎", "🐉", "📜", "🧙",
  "🔥", "❄️", "⚡", "💧", "🌳", "💀", "👁️", "🩸", "🪙", "👑",
  "🏹", "🪓", "💉", "🐎", "🚢", "🏕️", "📖", "✒️", "🎒", "🔮"
];

export default function CreateTemplateModal({
  isModalOpen,
  setIsModalOpen,
  initialData,
}: CreateTemplateModalProps) {
  const templateMutation = useCreateTemplate();
  const templateUpdateMutation = useUpdateTemplate();
  const params = useParams();
  const campaignId = params.id as string;
  const queryClient = useQueryClient();
  const { t } = useLocale();

  const FIELD_TYPES = [
    { value: "text", label: t.modals.fieldTypeText },
    { value: "textarea", label: t.modals.fieldTypeTextarea },
    { value: "number", label: t.modals.fieldTypeNumber },
    { value: "select", label: t.modals.fieldTypeSelect },
  ];

  const [fields, setFields] = useState<SchemaField[]>([]);
  const [newField, setNewField] = useState<SchemaField>({
    name: "",
    type: "text",
    label: "",
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newFieldOptions, setNewFieldOptions] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      icon: initialData?.icon || "📄",
    },
    resolver: zodResolver(templateSchema),
  });

  useEffect(() => {
    if (initialData && isModalOpen) {
      setFields((initialData.schema as unknown as SchemaField[]) || []);
      reset({
        name: initialData.name,
        description: initialData.description,
        icon: initialData.icon,
      });
    } else if (!isModalOpen) {
      setFields([]);
      reset({ name: "", description: "", icon: "📄" });
    }
  }, [initialData, isModalOpen, reset]);

  const selectedIcon = watch("icon");

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewField({ name: "", type: "text", label: "" });
    setEditingIndex(null);
  };

  const addField = () => {
    if (!newField.name || !newField.label) return;
    const addedField: SchemaField = { ...newField };
    if (newField.type === "select" && newFieldOptions.trim() !== "") {
      addedField.options = newFieldOptions
        .split(",")
        .map((o) => o.trim())
        .filter((o) => o !== "");
    }
    
    if (editingIndex !== null) {
      const updatedFields = [...fields];
      updatedFields[editingIndex] = addedField;
      setFields(updatedFields);
      setEditingIndex(null);
    } else {
      setFields([...fields, addedField]);
    }
    setNewField({ name: "", type: "text", label: "" });
    setNewFieldOptions("");
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const editField = (index: number) => {
    const fieldToEdit = fields[index];
    setNewField({
      name: fieldToEdit.name,
      type: fieldToEdit.type,
      label: fieldToEdit.label,
    });
    setNewFieldOptions(fieldToEdit.options ? fieldToEdit.options.join(", ") : "");
    setEditingIndex(index);
  };

  const moveFieldUp = (index: number) => {
    if (index === 0) return;
    const updatedFields = [...fields];
    [updatedFields[index - 1], updatedFields[index]] = [updatedFields[index], updatedFields[index - 1]];
    setFields(updatedFields);
    if (editingIndex === index) setEditingIndex(index - 1);
    else if (editingIndex === index - 1) setEditingIndex(index);
  };

  const moveFieldDown = (index: number) => {
    if (index === fields.length - 1) return;
    const updatedFields = [...fields];
    [updatedFields[index], updatedFields[index + 1]] = [updatedFields[index + 1], updatedFields[index]];
    setFields(updatedFields);
    if (editingIndex === index) setEditingIndex(index + 1);
    else if (editingIndex === index + 1) setEditingIndex(index);
  };

  const onSubmit = async (data: FormData) => {
    if (initialData) {
      templateUpdateMutation.mutate(
        {
          campaignId,
          templateId: initialData.id,
          name: data.name,
          description: data.description,
          icon: data.icon,
          schema: fields as unknown as Record<string, unknown>,
          defaultContent: {},
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
    } else {
      templateMutation.mutate(
        {
          campaignId,
          name: data.name,
          description: data.description,
          icon: data.icon,
          schema: fields as unknown as Record<string, unknown>,
          defaultContent: {},
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
    }
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
            borderRadius: { xs: "20px", md: "24px" },
            width: { xs: "calc(100% - 24px)", sm: "600px" },
            maxWidth: "600px",
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
          {initialData ? t.modals.editTemplate : t.modals.newTemplate}
        </Typography>
        <Typography
          component="span"
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
          {initialData ? t.modals.configureTemplate : t.modals.createTemplate}
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            px: { xs: 2, sm: 3 },
            pt: 2,
            maxHeight: { xs: "70vh", md: "60vh" },
            overflowY: "auto",
          }}
        >
          {/* Name */}
          <TextField
            label={t.modals.templateNameLabel}
            placeholder={t.modals.templateNamePlaceholder}
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

          {/* Description */}
          <TextField
            label={t.modals.templateDescLabel}
            placeholder={t.modals.templateDescPlaceholder}
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
              {t.modals.templateIconLabel}
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {ICON_OPTIONS.map((icon) => {
                const isSelected = selectedIcon === icon;

                return (
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
                          border: isSelected
                            ? "2px solid #BA68C8"
                            : "1px solid rgba(255,255,255,0.08)",
                          bgcolor: isSelected
                            ? "rgba(186, 104, 200, 0.15)"
                            : "transparent",
                          "&:hover": {
                            borderColor: "rgba(142, 36, 170, 0.4)",
                            bgcolor: isSelected
                              ? "rgba(186, 104, 200, 0.25)"
                              : "rgba(255,255,255,0.05)",
                          },
                        }}
                      />
                    </label>
                  </Box>
                );
              })}
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
              {t.modals.templateFieldsLabel}
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
                    <Typography>
                      {field.name} •{" "}
                      {FIELD_TYPES.find((type) => type.value === field.type)?.label}
                      {field.type === "select" &&
                        field.options &&
                        ` • ${t.modals.fieldOptions}: ${field.options.join(", ")}`}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton
                      size="small"
                      onClick={() => moveFieldUp(index)}
                      disabled={index === 0}
                      sx={{ color: "text.secondary", "&.Mui-disabled": { opacity: 0.3 } }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>↑</span>
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => moveFieldDown(index)}
                      disabled={index === fields.length - 1}
                      sx={{ color: "text.secondary", "&.Mui-disabled": { opacity: 0.3 } }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>↓</span>
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => editField(index)}
                      sx={{ color: "info.main", "&:hover": { bgcolor: "rgba(88, 166, 255, 0.08)" } }}
                    >
                      <span style={{ fontSize: "1rem" }}>✎</span>
                    </IconButton>
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
                  </Stack>
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
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <TextField
                    label={t.modals.templateFieldName}
                    placeholder={t.modals.templateFieldNamePlaceholder}
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
                    label={t.modals.templateFieldLabel}
                    placeholder={t.modals.templateFieldLabelPlaceholder}
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
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  alignItems={{ xs: "stretch", sm: "center" }}
                >
                  <TextField
                    label={t.modals.fieldType}
                    select
                    size="small"
                    value={newField.type}
                    onChange={(e) =>
                      setNewField({ ...newField, type: e.target.value })
                    }
                    slotProps={{
                      select: {
                        MenuProps: {
                          PaperProps: {
                            sx: { maxHeight: 250 },
                          },
                        },
                      },
                    }}
                    sx={{
                      minWidth: { sm: 140 },
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
                  {newField.type === "select" && (
                    <TextField
                      label={t.modals.fieldOptions}
                      placeholder={t.modals.templateFieldOptionsPlaceholder}
                      size="small"
                      fullWidth
                      value={newFieldOptions}
                      onChange={(e) => setNewFieldOptions(e.target.value)}
                      sx={{
                        mt: 1.5,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "10px",
                          bgcolor: "rgba(13, 17, 23, 0.4)",
                        },
                      }}
                    />
                  )}
                </Stack>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  alignItems={{ xs: "stretch", sm: "center" }}
                >
                  <IconButton
                    onClick={addField}
                    disabled={
                      !newField.name ||
                      !newField.label ||
                      (newField.type === "select" &&
                        newFieldOptions.trim() === "")
                    }
                    sx={{
                      color: editingIndex !== null ? "info.main" : "#BA68C8",
                      border: `1px solid ${editingIndex !== null ? "rgba(88, 166, 255, 0.3)" : "rgba(142, 36, 170, 0.3)"}`,
                      borderRadius: "10px",
                      alignSelf: { xs: "stretch", sm: "center" },
                      "&:hover": { bgcolor: editingIndex !== null ? "rgba(88, 166, 255, 0.08)" : "rgba(142, 36, 170, 0.08)" },
                      "&.Mui-disabled": { opacity: 0.3 },
                      px: editingIndex !== null ? 2 : undefined,
                    }}
                  >
                    {editingIndex !== null ? <span style={{fontSize: "0.85rem", fontWeight: 600}}>{t.modals.save}</span> : <AddIcon fontSize="small" />}
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
          </Box>
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
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.04)" },
            }}
          >
            {t.modals.cancel}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={
              templateMutation.isPending ||
              templateUpdateMutation.isPending ||
              fields.length === 0
            }
            sx={{
              borderRadius: "12px",
              px: 3,
              width: { xs: "100%", sm: "auto" },
              background: "linear-gradient(135deg, #BA68C8 0%, #8E24AA 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #CE93D8 0%, #BA68C8 100%)",
              },
            }}
          >
            {initialData ? t.modals.saveTemplate : t.modals.createTemplate}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
