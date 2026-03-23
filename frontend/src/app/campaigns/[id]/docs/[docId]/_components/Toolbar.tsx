"use client";

import { Editor } from "@tiptap/react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import { useState } from "react";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import CodeIcon from "@mui/icons-material/Code";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import FormatClearIcon from "@mui/icons-material/FormatClear";

interface EditorToolbarProps {
  editor: Editor;
}

const TEXT_COLORS = [
  { label: "Padrão", value: "" },
  { label: "Dourado", value: "#D4AF37" },
  { label: "Dourado Claro", value: "#E8CC6E" },
  { label: "Roxo", value: "#BA68C8" },
  { label: "Vermelho", value: "#F85149" },
  { label: "Verde", value: "#3FB950" },
  { label: "Azul", value: "#58A6FF" },
  { label: "Laranja", value: "#F0883E" },
  { label: "Cinza", value: "#8B949E" },
  { label: "Branco", value: "#FFFFFF" },
];

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const [colorAnchor, setColorAnchor] = useState<HTMLElement | null>(null);

  const handleColorClick = (event: React.MouseEvent<HTMLElement>) => {
    setColorAnchor(event.currentTarget);
  };

  const handleColorClose = () => {
    setColorAnchor(null);
  };

  const applyColor = (color: string) => {
    if (color === "") {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
    handleColorClose();
  };

  const ToolbarButton = ({
    onClick,
    isActive,
    tooltip,
    children,
  }: {
    onClick: () => void;
    isActive?: boolean;
    tooltip: string;
    children: React.ReactNode;
  }) => (
    <Tooltip title={tooltip} arrow>
      <IconButton
        onClick={onClick}
        size="small"
        sx={{
          color: isActive ? "#D4AF37" : "text.secondary",
          bgcolor: isActive ? "rgba(212, 175, 55, 0.1)" : "transparent",
          borderRadius: "8px",
          p: 0.8,
          transition: "all 0.15s ease",
          "&:hover": {
            bgcolor: isActive
              ? "rgba(212, 175, 55, 0.15)"
              : "rgba(255, 255, 255, 0.06)",
            color: isActive ? "#E8CC6E" : "text.primary",
          },
        }}
      >
        {children}
      </IconButton>
    </Tooltip>
  );

  const ToolbarDivider = () => (
    <Divider
      orientation="vertical"
      flexItem
      sx={{
        mx: 0.5,
        borderColor: "rgba(255, 255, 255, 0.06)",
      }}
    />
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 0.3,
        px: 2,
        py: 1,
        borderBottom: "1px solid rgba(212, 175, 55, 0.06)",
        bgcolor: "rgba(13, 17, 23, 0.3)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Headings */}
      {[1, 2, 3].map((level) => (
        <ToolbarButton
          key={level}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: level as 1 | 2 | 3 })
              .run()
          }
          isActive={editor.isActive("heading", { level })}
          tooltip={`Título ${level}`}
        >
          <Box
            component="span"
            sx={{
              fontSize: "0.75rem",
              fontWeight: 800,
              fontFamily: '"Merriweather", serif',
              lineHeight: 1,
              minWidth: "18px",
              textAlign: "center",
            }}
          >
            H{level}
          </Box>
        </ToolbarButton>
      ))}

      <ToolbarDivider />

      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        tooltip="Negrito"
      >
        <FormatBoldIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        tooltip="Itálico"
      >
        <FormatItalicIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        tooltip="Sublinhado"
      >
        <FormatUnderlinedIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        tooltip="Tachado"
      >
        <StrikethroughSIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        tooltip="Lista"
      >
        <FormatListBulletedIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        tooltip="Lista Numerada"
      >
        <FormatListNumberedIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Block elements */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        tooltip="Citação"
      >
        <FormatQuoteIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
        tooltip="Bloco de Código"
      >
        <CodeIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        tooltip="Linha Horizontal"
      >
        <HorizontalRuleIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarButton>

      <ToolbarDivider />

      {/* Color */}
      <Tooltip title="Cor do Texto" arrow>
        <IconButton
          onClick={handleColorClick}
          size="small"
          sx={{
            color: editor.getAttributes("textStyle").color || "text.secondary",
            borderRadius: "8px",
            p: 0.8,
            transition: "all 0.15s ease",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.06)",
              color: "text.primary",
            },
          }}
        >
          <FormatColorTextIcon sx={{ fontSize: "1.1rem" }} />
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(colorAnchor)}
        anchorEl={colorAnchor}
        onClose={handleColorClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "background.paper",
              border: "1px solid rgba(212, 175, 55, 0.12)",
              borderRadius: "14px",
              p: 1.5,
              boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 0.8,
          }}
        >
          {TEXT_COLORS.map((color) => (
            <Tooltip key={color.label} title={color.label} arrow>
              <Box
                onClick={() => applyColor(color.value)}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "8px",
                  bgcolor: color.value || "#E6E6E6",
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor:
                    editor.getAttributes("textStyle").color === color.value
                      ? "#D4AF37"
                      : "rgba(255,255,255,0.08)",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    transform: "scale(1.15)",
                    borderColor: "rgba(212, 175, 55, 0.4)",
                  },
                }}
              />
            </Tooltip>
          ))}
        </Box>
      </Popover>

      {/* Clear formatting */}
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
        tooltip="Limpar Formatação"
      >
        <FormatClearIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarButton>
    </Box>
  );
}
