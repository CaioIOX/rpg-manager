"use client";

import { Editor } from "@tiptap/react";
import CodeIcon from "@mui/icons-material/Code";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import { Box, Divider, IconButton, Popover, Tooltip } from "@mui/material";
import { useState } from "react";

interface EditorToolbarProps {
  editor: Editor;
}

interface ToolbarActionButtonProps {
  onClick: () => void;
  isActive?: boolean;
  tooltip: string;
  children: React.ReactNode;
}

const TEXT_COLORS = [
  { label: "Padrao", value: "" },
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

function ToolbarActionButton({
  onClick,
  isActive,
  tooltip,
  children,
}: ToolbarActionButtonProps) {
  return (
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
}

function ToolbarDivider() {
  return (
    <Divider
      orientation="vertical"
      flexItem
      sx={{
        mx: 0.5,
        borderColor: "rgba(255, 255, 255, 0.06)",
      }}
    />
  );
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const [colorAnchor, setColorAnchor] = useState<HTMLElement | null>(null);

  const applyColor = (color: string) => {
    if (color === "") {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
    setColorAnchor(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 0.3,
        px: { xs: 1, sm: 1.5, md: 2 },
        py: 1,
        borderBottom: "1px solid rgba(212, 175, 55, 0.06)",
        bgcolor: "rgba(13, 17, 23, 0.3)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: "blur(12px)",
        overflowX: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {[1, 2, 3].map((level) => (
        <ToolbarActionButton
          key={level}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: level as 1 | 2 | 3 })
              .run()
          }
          isActive={editor.isActive("heading", { level })}
          tooltip={`Titulo ${level}`}
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
        </ToolbarActionButton>
      ))}

      <ToolbarDivider />

      <ToolbarActionButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        tooltip="Negrito"
      >
        <FormatBoldIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarActionButton>
      <ToolbarActionButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        tooltip="Italico"
      >
        <FormatItalicIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarActionButton>
      <ToolbarActionButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        tooltip="Sublinhado"
      >
        <FormatUnderlinedIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarActionButton>
      <ToolbarActionButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        tooltip="Tachado"
      >
        <StrikethroughSIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarActionButton>

      <ToolbarDivider />

      <ToolbarActionButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        tooltip="Lista"
      >
        <FormatListBulletedIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarActionButton>
      <ToolbarActionButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        tooltip="Lista numerada"
      >
        <FormatListNumberedIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarActionButton>

      <ToolbarDivider />

      <ToolbarActionButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        tooltip="Citacao"
      >
        <FormatQuoteIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarActionButton>
      <ToolbarActionButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
        tooltip="Bloco de codigo"
      >
        <CodeIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarActionButton>
      <ToolbarActionButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        tooltip="Linha horizontal"
      >
        <HorizontalRuleIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarActionButton>

      <ToolbarDivider />

      <Tooltip title="Cor do texto" arrow>
        <IconButton
          onClick={(event) => setColorAnchor(event.currentTarget)}
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
        onClose={() => setColorAnchor(null)}
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

      <ToolbarActionButton
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
        tooltip="Limpar formatacao"
      >
        <FormatClearIcon sx={{ fontSize: "1.1rem" }} />
      </ToolbarActionButton>
    </Box>
  );
}
