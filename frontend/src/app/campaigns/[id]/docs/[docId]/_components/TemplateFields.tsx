"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Template } from "@/lib/types/Template";
import MentionTextField from "./MentionTextField";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TemplateField {
  name: string;
  type: string;
  label: string;
  options?: string[];
}

type TemplateVariant = "panel" | "inline";

interface TemplateFieldsProps {
  template: Template;
  initialData?: Record<string, string>;
  campaignId: string;
  onChange: (data: Record<string, string>) => void;
  /** 'panel' = single-column for right sidebar; 'inline' = 2-col grid for mobile */
  variant?: TemplateVariant;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface TemplateHeaderProps {
  template: Template;
  isExpanded: boolean;
  onToggle: () => void;
}

function TemplateHeader({ template, isExpanded, onToggle }: TemplateHeaderProps) {
  return (
    <Box
      onClick={onToggle}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        cursor: "pointer",
        userSelect: "none",
        "&:hover .template-chevron": { color: "#BA68C8" },
      }}
    >
      <Typography sx={{ fontSize: "1.1rem", lineHeight: 1 }}>
        {template.icon}
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 700,
          color: "#BA68C8",
          textTransform: "uppercase",
          fontSize: "0.7rem",
          letterSpacing: "0.08em",
          lineHeight: 1.5,
          flex: 1,
        }}
      >
        {template.name}
      </Typography>
      <KeyboardArrowDownIcon
        className="template-chevron"
        sx={{
          fontSize: "1rem",
          color: "rgba(186, 104, 200, 0.5)",
          transition: "transform 0.2s ease, color 0.2s ease",
          transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
        }}
      />
    </Box>
  );
}

// ─── Field renderers ─────────────────────────────────────────────────────────

interface FieldProps {
  field: TemplateField;
  value: string;
  campaignId: string;
  onChange: (name: string, value: string) => void;
}

function TextareaField({ field, value, campaignId, onChange }: FieldProps) {
  return (
    <Box sx={{ gridColumn: "1 / -1" }}>
      <MentionTextField
        label={field.label}
        value={value}
        onChange={(v) => onChange(field.name, v)}
        campaignId={campaignId}
        multiline
        rows={3}
        fullWidth
      />
    </Box>
  );
}

function SelectField({ field, value, onChange }: FieldProps) {
  return (
    <TextField
      label={field.label}
      select
      fullWidth
      value={value}
      onChange={(e) => onChange(field.name, e.target.value)}
      variant="outlined"
      slotProps={{
        select: {
          MenuProps: { PaperProps: { sx: { maxHeight: 250 } } },
        },
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "14px",
          bgcolor: "rgba(13, 17, 23, 0.4)",
        },
      }}
    >
      {field.options!.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}

function TextInputField({ field, value, campaignId, onChange }: FieldProps) {
  if (field.type === "number") {
    return (
      <TextField
        label={field.label}
        fullWidth
        type="number"
        value={value}
        onChange={(e) => onChange(field.name, e.target.value)}
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "14px",
            bgcolor: "rgba(13, 17, 23, 0.4)",
          },
        }}
      />
    );
  }

  return (
    <MentionTextField
      label={field.label}
      value={value}
      onChange={(v) => onChange(field.name, v)}
      campaignId={campaignId}
      fullWidth
    />
  );
}

function TemplateFieldItem(props: FieldProps) {
  if (props.field.type === "textarea") return <TextareaField {...props} />;
  if (props.field.type === "select" && props.field.options)
    return <SelectField {...props} />;
  return <TextInputField {...props} />;
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TemplateFields({
  template,
  initialData,
  campaignId,
  onChange,
  variant = "inline",
}: TemplateFieldsProps) {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(
    initialData ?? {},
  );

  // Panel (desktop): start expanded.  Inline (mobile): start collapsed.
  const [isExpanded, setIsExpanded] = useState(variant === "panel");

  const schema = (template.schema as unknown as TemplateField[]) ?? [];

  const handleChange = (fieldName: string, value: string) => {
    const updated = { ...fieldValues, [fieldName]: value };
    setFieldValues(updated);
    onChange(updated);
  };

  if (schema.length === 0) return null;

  const isPanelVariant = variant === "panel";

  return (
    <Box
      sx={
        isPanelVariant
          ? {
              // Panel: top padding handled by TemplateSidePanel (pt:4 for toolbar alignment)
              pt: 0,
              px: 2,
              pb: 2,
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }
          : {
              // Inline: card with border (mobile)
              mb: 3,
              p: { xs: 2, sm: 2.5, md: 3 },
              borderRadius: { xs: "16px", md: "20px" },
              bgcolor: "rgba(142, 36, 170, 0.04)",
              border: "1px solid rgba(142, 36, 170, 0.1)",
              transition: "border-color 0.3s ease",
              "&:hover": { borderColor: "rgba(142, 36, 170, 0.18)" },
            }
      }
    >
      {/* Header — in panel mode it also acts as a sticky section title */}
      <Box
        sx={
          isPanelVariant
            ? {
                pb: 2,
                mb: 2,
                borderBottom: "1px solid rgba(212, 175, 55, 0.08)",
              }
            : {
                mb: isExpanded ? 2 : 0,
              }
        }
      >
        <TemplateHeader
          template={template}
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded((p) => !p)}
        />
      </Box>

      {/* Fields */}
      <Collapse in={isExpanded} timeout={200}>
        <Box
          sx={
            isPanelVariant
              ? {
                  // Single-column layout for the sidebar panel
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }
              : {
                  // Two-column grid for inline (mobile) layout
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }
          }
        >
          {schema.map((field) => (
            <TemplateFieldItem
              key={field.name}
              field={field}
              value={fieldValues[field.name] ?? ""}
              campaignId={campaignId}
              onChange={handleChange}
            />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
