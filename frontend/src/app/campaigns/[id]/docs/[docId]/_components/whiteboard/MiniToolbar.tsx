"use client";

import { createPortal } from "react-dom";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useLayoutEffect, useRef, useState } from "react";

const COLORS = ["#FFFFFF", "#F9E04B", "#81C784", "#64B5F6", "#CE93D8", "#F48FB1", "#FF8A65", "#CCCCCC"];
const FONT_SIZES = [{ label: "S", px: "11px" }, { label: "M", px: "15px" }, { label: "L", px: "21px" }, { label: "XL", px: "30px" }];

const btnSx = {
  p: "2px",
  minWidth: 0,
  color: "rgba(210,210,210,0.9)",
  borderRadius: "4px",
  "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.12)" },
};

interface Props {
  editorRef: React.RefObject<HTMLDivElement | null>;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

export default function MiniToolbar({ editorRef, anchorRef }: Props) {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  useLayoutEffect(() => {
    if (!anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    const top = Math.max(8, r.top - 52);
    const left = Math.max(8, r.left);
    setPos({ top, left, width: r.width });
  }, [anchorRef]);

  const focus = () => editorRef.current?.focus();
  const exec = (cmd: string, val?: string) => { document.execCommand(cmd, false, val); focus(); };

  const applySize = (px: string) => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) { focus(); return; }
    const range = sel.getRangeAt(0);
    try {
      const span = document.createElement("span");
      span.style.fontSize = px;
      range.surroundContents(span);
    } catch { /* overlapping ranges */ }
    focus();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <Box
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => e.stopPropagation()}
      sx={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        flexWrap: "nowrap",
        gap: 0.25,
        px: 0.75,
        py: 0.5,
        bgcolor: "rgba(14,14,18,0.97)",
        borderRadius: "8px",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 4px 18px rgba(0,0,0,0.75)",
        whiteSpace: "nowrap",
        pointerEvents: "all",
      }}
    >
      <Tooltip title="Negrito (Ctrl+B)"><IconButton size="small" sx={btnSx} onMouseDown={(e) => e.preventDefault()} onClick={() => exec("bold")}><FormatBoldIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
      <Tooltip title="Itálico (Ctrl+I)"><IconButton size="small" sx={btnSx} onMouseDown={(e) => e.preventDefault()} onClick={() => exec("italic")}><FormatItalicIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
      <Tooltip title="Sublinhado (Ctrl+U)"><IconButton size="small" sx={btnSx} onMouseDown={(e) => e.preventDefault()} onClick={() => exec("underline")}><FormatUnderlinedIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>
      <Tooltip title="Tachado"><IconButton size="small" sx={btnSx} onMouseDown={(e) => e.preventDefault()} onClick={() => exec("strikeThrough")}><StrikethroughSIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.25, borderColor: "rgba(255,255,255,0.1)" }} />

      {FONT_SIZES.map(({ label, px }) => (
        <Tooltip key={label} title={`Tamanho ${label}`}>
          <IconButton size="small" sx={{ ...btnSx, fontSize: 10, fontWeight: 700 }} onMouseDown={(e) => e.preventDefault()} onClick={() => applySize(px)}>
            {label}
          </IconButton>
        </Tooltip>
      ))}

      <Divider orientation="vertical" flexItem sx={{ mx: 0.25, borderColor: "rgba(255,255,255,0.1)" }} />

      <Tooltip title="Lista em tópicos"><IconButton size="small" sx={btnSx} onMouseDown={(e) => e.preventDefault()} onClick={() => exec("insertUnorderedList")}><FormatListBulletedIcon sx={{ fontSize: 15 }} /></IconButton></Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.25, borderColor: "rgba(255,255,255,0.1)" }} />

      {COLORS.map((c) => (
        <Box
          key={c}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec("foreColor", c)}
          sx={{ width: 13, height: 13, bgcolor: c, borderRadius: "50%", cursor: "pointer", border: "1.5px solid rgba(255,255,255,0.25)", flexShrink: 0, "&:hover": { transform: "scale(1.3)" }, transition: "transform 0.1s" }}
        />
      ))}
    </Box>,
    document.body,
  );
}
