"use client";

import { Template } from "@/lib/types/Template";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";

interface TemplateField {
  name: string;
  type: string;
  label: string;
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
  const [isExpanded, setIsExpanded] = useState(true);

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
        maxWidth: "960px",
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
        onClick={() => setIsExpanded((prev) => !prev)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: isExpanded ? 2 : 0,
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

      <Collapse in={isExpanded} timeout={200}>
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
      </Collapse>
    </Box>
  );
}
