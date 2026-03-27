"use client";

import { NodeProps, Handle, Position, NodeResizer } from "@xyflow/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export type StickyNoteData = {
  text: string;
  color: string;
};

export default function StickyNoteNode({ data, selected }: NodeProps) {
  const nodeData = data as StickyNoteData;
  const [editing, setEditing] = useState(false);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minWidth: 140,
        minHeight: 100,
        bgcolor: nodeData.color || "#F9E04B",
        borderRadius: "4px",
        p: 1.5,
        boxShadow: selected
          ? "0 0 0 2px #D4AF37, 0 4px 16px rgba(0,0,0,0.5)"
          : "2px 4px 12px rgba(0,0,0,0.4)",
        cursor: "default",
        position: "relative",
        transition: "box-shadow 0.2s",
        overflow: "hidden",
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
      <NodeResizer
        isVisible={selected}
        minWidth={140}
        minHeight={100}
        lineStyle={{ border: "1px dashed rgba(212,175,55,0.7)" }}
        handleStyle={{ background: "#D4AF37", border: "none", width: 8, height: 8, borderRadius: 2 }}
      />
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
            height: "calc(100% - 12px)",
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
