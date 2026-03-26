"use client";

import { NodeProps, Handle, Position, NodeResizer } from "@xyflow/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export type DocumentCardData = {
  docId: string;
  title: string;
  preview?: string;
};

const HANDLE_STYLE = { zIndex: 10 };

export default function DocumentCardNode({ data, selected }: NodeProps) {
  const nodeData = data as DocumentCardData;

  const handleOpen = () => {
    if (!nodeData.docId) return;
    const parts = window.location.pathname.split("/");
    const idx = parts.indexOf("campaigns");
    if (idx !== -1) {
      window.open(`/campaigns/${parts[idx + 1]}/docs/${nodeData.docId}`, "_self");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minWidth: 160,
        minHeight: 70,
        borderRadius: "12px",
        border: "1.5px solid",
        borderColor: selected ? "rgba(212,175,55,0.7)" : "rgba(212,175,55,0.22)",
        bgcolor: "rgba(13,17,23,0.92)",
        backdropFilter: "blur(8px)",
        p: 1.75,
        boxShadow: selected
          ? "0 0 0 2px #D4AF37, 0 8px 24px rgba(0,0,0,0.5)"
          : "0 4px 16px rgba(0,0,0,0.4)",
        transition: "all 0.2s ease",
        cursor: "default",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
      }}
    >
      <NodeResizer isVisible={selected} minWidth={160} minHeight={70} />
      <Handle id="top" type="source" position={Position.Top} style={HANDLE_STYLE} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={HANDLE_STYLE} />
      <Handle id="left" type="source" position={Position.Left} style={HANDLE_STYLE} />
      <Handle id="right" type="source" position={Position.Right} style={HANDLE_STYLE} />

      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
        <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 2 }}>📄</span>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: "text.primary", lineHeight: 1.3, wordBreak: "break-word" }}
        >
          {nodeData.title || "Documento sem título"}
        </Typography>
      </Box>

      {nodeData.preview && (
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.4,
          }}
        >
          {nodeData.preview}
        </Typography>
      )}

      <Typography
        component="span"
        variant="caption"
        onClick={(e) => {
          e.stopPropagation();
          handleOpen();
        }}
        sx={{
          color: "rgba(212,175,55,0.7)",
          fontSize: "0.7rem",
          fontWeight: 500,
          mt: "auto",
          cursor: "pointer",
          "&:hover": { color: "#D4AF37" },
          transition: "color 0.15s",
        }}
      >
        ↗ Abrir documento
      </Typography>
    </Box>
  );
}
