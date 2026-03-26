"use client";

import { NodeProps, Handle, Position, NodeResizer } from "@xyflow/react";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useEffect, useRef, useState } from "react";

export type TextNodeData = {
  html: string;
};

const TEXT_COLORS = [
  "#FFFFFF", "#CCCCCC", "#F9E04B", "#81C784",
  "#64B5F6", "#CE93D8", "#F48FB1", "#FF8A65",
];

const FONT_SIZES = [
  { label: "S", size: "12px" },
  { label: "M", size: "16px" },
  { label: "L", size: "22px" },
  { label: "XL", size: "30px" },
];

function execFmt(cmd: string, value?: string) {
  document.execCommand(cmd, false, value);
}

interface MiniToolbarProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
}

function MiniToolbar({ editorRef }: MiniToolbarProps) {
  const focus = () => editorRef.current?.focus();

  const btnSx = {
    p: "2px",
    borderRadius: "4px",
    color: "rgba(220,220,220,0.85)",
    minWidth: 0,
    "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.1)" },
  };

  return (
    <Box
      onMouseDown={(e) => e.preventDefault()} // keep focus in editor
      sx={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 0.25,
        px: 0.75,
        py: 0.5,
        mb: 0.5,
        bgcolor: "rgba(18,18,22,0.97)",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
      }}
    >
      <Tooltip title="Negrito (Ctrl+B)"><IconButton size="small" sx={btnSx} onClick={() => { execFmt("bold"); focus(); }}><FormatBoldIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
      <Tooltip title="Itálico (Ctrl+I)"><IconButton size="small" sx={btnSx} onClick={() => { execFmt("italic"); focus(); }}><FormatItalicIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
      <Tooltip title="Sublinhado (Ctrl+U)"><IconButton size="small" sx={btnSx} onClick={() => { execFmt("underline"); focus(); }}><FormatUnderlinedIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
      <Tooltip title="Tachado"><IconButton size="small" sx={btnSx} onClick={() => { execFmt("strikeThrough"); focus(); }}><StrikethroughSIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.25, borderColor: "rgba(255,255,255,0.12)" }} />

      {FONT_SIZES.map(({ label, size }) => (
        <Tooltip key={label} title={`Tamanho ${label}`}>
          <IconButton
            size="small"
            sx={{ ...btnSx, width: 20, height: 20, fontSize: label === "S" ? 9 : label === "M" ? 11 : label === "L" ? 13 : 15 }}
            onClick={() => {
              execFmt("insertHTML", `<span style="font-size:${size}">\u200b</span>`);
              // Apply to selection
              const sel = window.getSelection();
              if (sel && !sel.isCollapsed) {
                execFmt("fontSize", "7");
                // Replace font tags with span
                const elems = editorRef.current?.querySelectorAll('font[size="7"]');
                elems?.forEach(el => {
                  const span = document.createElement("span");
                  span.style.fontSize = size;
                  span.innerHTML = (el as HTMLElement).innerHTML;
                  el.parentNode?.replaceChild(span, el);
                });
              }
              focus();
            }}
          >
            {label}
          </IconButton>
        </Tooltip>
      ))}

      <Divider orientation="vertical" flexItem sx={{ mx: 0.25, borderColor: "rgba(255,255,255,0.12)" }} />

      <Tooltip title="Lista em tópicos">
        <IconButton size="small" sx={btnSx} onClick={() => { execFmt("insertUnorderedList"); focus(); }}>
          <FormatListBulletedIcon sx={{ fontSize: 15 }} />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.25, borderColor: "rgba(255,255,255,0.12)" }} />

      {/* Color dots */}
      {TEXT_COLORS.map((color) => (
        <Tooltip key={color} title={`Cor: ${color}`}>
          <Box
            onClick={() => { execFmt("foreColor", color); focus(); }}
            sx={{
              width: 14,
              height: 14,
              bgcolor: color,
              borderRadius: "50%",
              cursor: "pointer",
              border: "1.5px solid rgba(255,255,255,0.25)",
              flexShrink: 0,
              "&:hover": { transform: "scale(1.3)" },
              transition: "transform 0.1s",
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
}

export default function TextNode({ data, selected, id }: NodeProps) {
  const nodeData = data as TextNodeData;
  const [editing, setEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Init editor content when editing starts
  useEffect(() => {
    if (editing && editorRef.current) {
      editorRef.current.innerHTML = nodeData.html || "";
      // Place cursor at end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
      editorRef.current.focus();
    }
  }, [editing]);

  const handleBlur = () => {
    if (editorRef.current) {
      nodeData.html = editorRef.current.innerHTML;
    }
    setEditing(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minWidth: 80,
        minHeight: 32,
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={80}
        minHeight={32}
      />
      <Handle id="top" type="source" position={Position.Top} />
      <Handle id="bottom" type="source" position={Position.Bottom} />
      <Handle id="left" type="source" position={Position.Left} />
      <Handle id="right" type="source" position={Position.Right} />

      {editing && <MiniToolbar editorRef={editorRef} />}

      {editing ? (
        <Box
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          sx={{
            flex: 1,
            outline: "none",
            color: "#E6E6E6",
            fontSize: "1rem",
            lineHeight: 1.5,
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            caretColor: "#D4AF37",
            "& ul": { pl: 2.5, my: 0.5 },
            "& li": { mb: 0.25 },
          }}
        />
      ) : (
        <Box
          onDoubleClick={() => setEditing(true)}
          sx={{
            flex: 1,
            color: "#E6E6E6",
            fontSize: "1rem",
            lineHeight: 1.5,
            wordBreak: "break-word",
            whiteSpace: "pre-wrap",
            cursor: "text",
            userSelect: "none",
            border: selected ? "1px dashed rgba(212,175,55,0.4)" : "1px dashed transparent",
            borderRadius: "4px",
            px: 0.5,
            "& ul": { pl: 2.5, my: 0.5 },
            "& li": { mb: 0.25 },
          }}
          dangerouslySetInnerHTML={{
            __html: nodeData.html || '<span style="opacity:0.3;font-size:0.9rem">Duplo clique para editar...</span>',
          }}
        />
      )}
    </Box>
  );
}
