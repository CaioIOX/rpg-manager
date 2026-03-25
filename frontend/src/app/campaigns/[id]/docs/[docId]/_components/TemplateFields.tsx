"use client";

import { Template } from "@/lib/types/Template";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";

interface TemplateField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
}

interface TemplateFieldsProps {
  template: Template;
  initialData?: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

export default function TemplateFields({
  template,
  initialData,
  onChange,
}: TemplateFieldsProps) {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(
    initialData ?? {},
  );

  const schema = (template.schema as unknown as TemplateField[]) ?? [];

  const handleChange = (fieldName: string, value: string) => {
    const updated = { ...fieldValues, [fieldName]: value };
    setFieldValues(updated);
    onChange(updated);
  };

  if (schema.length === 0) return null;

  return (
    <Box
      sx={{
        maxWidth: "800px",
        mx: "auto",
        mb: 3,
        p: { xs: 2, sm: 2.5, md: 3 },
        borderRadius: { xs: "16px", md: "20px" },
        bgcolor: "rgba(142, 36, 170, 0.04)",
        border: "1px solid rgba(142, 36, 170, 0.1)",
        transition: "border-color 0.3s ease",
        "&:hover": {
          borderColor: "rgba(142, 36, 170, 0.18)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 2,
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
          }}
        >
          {template.name}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
        }}
      >
        {schema.map((field) => {
          if (field.type === "textarea") {
            return (
              <Box key={field.name} sx={{ gridColumn: "1 / -1" }}>
                <TextField
                  label={field.label}
                  fullWidth
                  multiline
                  rows={3}
                  required={field.required}
                  value={fieldValues[field.name] ?? ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "14px",
                      bgcolor: "rgba(13, 17, 23, 0.4)",
                    },
                  }}
                />
              </Box>
            );
          }

          if (field.type === "select" && field.options) {
            return (
              <TextField
                key={field.name}
                label={field.label}
                select
                fullWidth
                required={field.required}
                value={fieldValues[field.name] ?? ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "14px",
                    bgcolor: "rgba(13, 17, 23, 0.4)",
                  },
                }}
              >
                {field.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            );
          }

          return (
            <TextField
              key={field.name}
              label={field.label}
              fullWidth
              type={field.type === "number" ? "number" : "text"}
              required={field.required}
              value={fieldValues[field.name] ?? ""}
              onChange={(e) => handleChange(field.name, e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "14px",
                  bgcolor: "rgba(13, 17, 23, 0.4)",
                },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
}
