"use client";

import { NodeProps, Handle, Position } from "@xyflow/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export type ShapeNodeData = {
  label: string;
  shape: "rectangle" | "circle" | "diamond";
  color: string;
};

export default function ShapeNode({ data, selected }: NodeProps) {
  const nodeData = data as ShapeNodeData;
  const [editing, setEditing] = useState(false);

  const isCircle = nodeData.shape === "circle";
  const isDiamond = nodeData.shape === "diamond";

  return (
    <Box
      sx={{
        width: isCircle ? 120 : 140,
        height: isCircle ? 120 : isDiamond ? 100 : 64,
        bgcolor: nodeData.color || "rgba(100, 181, 246, 0.2)",
        border: "2px solid",
        borderColor: selected
          ? "#D4AF37"
          : nodeData.color || "rgba(100, 181, 246, 0.7)",
        borderRadius: isCircle ? "50%" : isDiamond ? "4px" : "10px",
        transform: isDiamond ? "rotate(45deg)" : undefined,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: selected
          ? "0 0 0 2px #D4AF37"
          : "0 4px 12px rgba(0,0,0,0.3)",
        transition: "all 0.2s",
        cursor: "default",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

      <Box
        sx={{
          transform: isDiamond ? "rotate(-45deg)" : undefined,
          px: 1,
          textAlign: "center",
        }}
      >
        {editing ? (
          <input
            autoFocus
            defaultValue={nodeData.label}
            onBlur={(e) => {
              nodeData.label = e.target.value;
              setEditing(false);
            }}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#E6E6E6",
              fontSize: "0.8rem",
              textAlign: "center",
              width: "80px",
            }}
          />
        ) : (
          <Typography
            onDoubleClick={() => setEditing(true)}
            sx={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "text.primary",
              userSelect: "none",
              cursor: "text",
              wordBreak: "break-word",
            }}
          >
            {nodeData.label || "Forma"}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
