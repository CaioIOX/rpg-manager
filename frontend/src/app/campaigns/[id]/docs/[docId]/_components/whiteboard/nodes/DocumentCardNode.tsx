"use client";

import { NodeProps, Handle, Position, NodeResizer } from "@xyflow/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export type DocumentCardData = {
  docId: string;
  title: string;
  preview?: string;
};

export default function DocumentCardNode({ data, selected }: NodeProps) {
  const nodeData = data as DocumentCardData;
  // Navigate via the link — no router needed, keeps it accessible
  const href = nodeData.docId ? `#doc-${nodeData.docId}` : undefined;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minWidth: 180,
        minHeight: 80,
        borderRadius: "12px",
        border: "1.5px solid",
        borderColor: selected
          ? "rgba(212, 175, 55, 0.7)"
          : "rgba(212, 175, 55, 0.2)",
        bgcolor: "rgba(13, 17, 23, 0.92)",
        backdropFilter: "blur(8px)",
        p: 2,
        boxShadow: selected
          ? "0 0 0 2px #D4AF37, 0 8px 24px rgba(0,0,0,0.5)"
          : "0 4px 16px rgba(0,0,0,0.4)",
        transition: "all 0.2s ease",
        cursor: "default",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={180}
        minHeight={80}
        lineStyle={{ border: "1px dashed rgba(212,175,55,0.7)" }}
        handleStyle={{ background: "#D4AF37", border: "none", width: 8, height: 8, borderRadius: 2 }}
      />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
        <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: 2 }}>📄</span>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            lineHeight: 1.3,
            wordBreak: "break-word",
          }}
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
        component="a"
        href={href}
        variant="caption"
        sx={{
          color: "rgba(212, 175, 55, 0.7)",
          fontSize: "0.7rem",
          fontWeight: 500,
          mt: "auto",
          "&:hover": { color: "#D4AF37" },
          transition: "color 0.15s",
          textDecoration: "none",
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (nodeData.docId) {
            // Find campaignId from the current path
            const parts = window.location.pathname.split("/");
            const campaignIdx = parts.indexOf("campaigns");
            if (campaignIdx !== -1) {
              window.open(
                `/campaigns/${parts[campaignIdx + 1]}/docs/${nodeData.docId}`,
                "_self",
              );
            }
          }
        }}
      >
        ↗ Abrir documento
      </Typography>
    </Box>
  );
}
