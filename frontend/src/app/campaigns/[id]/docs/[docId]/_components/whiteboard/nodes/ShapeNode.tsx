"use client";

import { NodeProps, Handle, Position, NodeResizer } from "@xyflow/react";
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

  const color = nodeData.color || "rgba(100, 181, 246, 0.25)";
  const borderColor = selected ? "#D4AF37" : (nodeData.color || "rgba(100,181,246,0.8)");

  const label = editing ? null : (
    <Typography
      onDoubleClick={() => setEditing(true)}
      sx={{
        fontSize: "0.82rem",
        fontWeight: 600,
        color: "#E6E6E6",
        userSelect: "none",
        cursor: "text",
        wordBreak: "break-word",
        textAlign: "center",
        px: 1,
        lineHeight: 1.2,
      }}
    >
      {nodeData.label || ""}
    </Typography>
  );

  const editInput = editing && (
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
        fontSize: "0.82rem",
        fontWeight: 600,
        textAlign: "center",
        width: "80%",
      }}
    />
  );

  if (nodeData.shape === "diamond") {
    // Diamond uses an absolutely positioned SVG so it scales with the node
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          minWidth: 100,
          minHeight: 80,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <NodeResizer
          isVisible={selected}
          minWidth={100}
          minHeight={80}
          lineStyle={{ border: "1px dashed rgba(212,175,55,0.7)" }}
          handleStyle={{ background: "#D4AF37", border: "none", width: 8, height: 8, borderRadius: 2 }}
        />
        <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
        <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />

        {/* SVG diamond that fills the node bounds */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon
            points="50,4 96,50 50,96 4,50"
            fill={color}
            stroke={borderColor}
            strokeWidth="3"
          />
        </svg>
        <Box sx={{ position: "relative", zIndex: 1 }}>
          {label}
          {editInput}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minWidth: 80,
        minHeight: 60,
        bgcolor: color,
        border: "2px solid",
        borderColor,
        borderRadius: nodeData.shape === "circle" ? "50%" : "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: selected
          ? "0 0 0 2px #D4AF37"
          : "0 4px 12px rgba(0,0,0,0.3)",
        transition: "all 0.2s",
        cursor: "default",
        overflow: "hidden",
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={80}
        minHeight={60}
        lineStyle={{ border: "1px dashed rgba(212,175,55,0.7)" }}
        handleStyle={{ background: "#D4AF37", border: "none", width: 8, height: 8, borderRadius: 2 }}
      />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
      {label}
      {editInput}
    </Box>
  );
}
