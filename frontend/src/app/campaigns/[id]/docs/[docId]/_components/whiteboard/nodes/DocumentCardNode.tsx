"use client";

import { NodeProps, Handle, Position } from "@xyflow/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { useRouter, useParams } from "next/navigation";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export type DocumentCardData = {
  docId: string;
  title: string;
  preview?: string;
};

export default function DocumentCardNode({ data, selected }: NodeProps) {
  const nodeData = data as DocumentCardData;
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const handleOpen = () => {
    if (nodeData.docId) {
      router.push(`/campaigns/${campaignId}/docs/${nodeData.docId}`);
    }
  };

  return (
    <Box
      sx={{
        width: 220,
        borderRadius: "12px",
        border: "1.5px solid",
        borderColor: selected
          ? "rgba(212, 175, 55, 0.7)"
          : "rgba(212, 175, 55, 0.2)",
        bgcolor: "rgba(13, 17, 23, 0.85)",
        backdropFilter: "blur(8px)",
        p: 2,
        boxShadow: selected
          ? "0 0 0 2px #D4AF37, 0 8px 24px rgba(0,0,0,0.5)"
          : "0 4px 16px rgba(0,0,0,0.4)",
        transition: "all 0.2s ease",
        cursor: "default",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
        <DescriptionOutlinedIcon
          sx={{ fontSize: 18, color: "#D4AF37", mt: 0.2, flexShrink: 0 }}
        />
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
            mb: 1.5,
            lineHeight: 1.4,
          }}
        >
          {nodeData.preview}
        </Typography>
      )}

      <Box
        onClick={handleOpen}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          cursor: "pointer",
          color: "rgba(212, 175, 55, 0.7)",
          fontSize: "0.7rem",
          fontWeight: 500,
          mt: 0.5,
          "&:hover": { color: "#D4AF37" },
          transition: "color 0.15s",
        }}
      >
        <OpenInNewIcon sx={{ fontSize: 12 }} />
        Abrir documento
      </Box>
    </Box>
  );
}
