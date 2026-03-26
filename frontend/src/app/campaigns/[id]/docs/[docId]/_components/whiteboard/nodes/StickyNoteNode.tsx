"use client";

import { NodeProps, Handle, Position } from "@xyflow/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export type StickyNoteData = {
  text: string;
  color: string;
};

const COLOR_OPTIONS = ["#F9E04B", "#81C784", "#64B5F6", "#F48FB1", "#CE93D8"];

export default function StickyNoteNode({ data, selected }: NodeProps) {
  const nodeData = data as StickyNoteData;
  const [editing, setEditing] = useState(false);

  return (
    <Box
      sx={{
        width: 200,
        minHeight: 140,
        bgcolor: nodeData.color || "#F9E04B",
        borderRadius: "4px",
        p: 1.5,
        boxShadow: selected
          ? "0 0 0 2px #D4AF37, 0 4px 16px rgba(0,0,0,0.4)"
          : "2px 4px 12px rgba(0,0,0,0.3)",
        cursor: "default",
        position: "relative",
        transition: "box-shadow 0.2s",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderLeft: "16px solid transparent",
          borderBottom: `16px solid rgba(0,0,0,0.15)`,
        },
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

      {editing ? (
        <textarea
          autoFocus
          defaultValue={nodeData.text}
          onBlur={(e) => {
            nodeData.text = e.target.value;
            setEditing(false);
          }}
          style={{
            width: "100%",
            minHeight: 100,
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            fontFamily: "inherit",
            fontSize: "0.85rem",
            color: "rgba(0,0,0,0.8)",
            fontWeight: 500,
          }}
        />
      ) : (
        <Typography
          variant="body2"
          onDoubleClick={() => setEditing(true)}
          sx={{
            color: "rgba(0,0,0,0.8)",
            fontWeight: 500,
            fontSize: "0.85rem",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            minHeight: 80,
            cursor: "text",
            userSelect: "none",
          }}
        >
          {nodeData.text || "Duplo clique para editar..."}
        </Typography>
      )}
    </Box>
  );
}
