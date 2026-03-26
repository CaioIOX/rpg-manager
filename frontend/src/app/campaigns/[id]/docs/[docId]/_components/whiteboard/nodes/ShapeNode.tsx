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

const HANDLE_STYLE = { zIndex: 10 };

function EditableLabel({
  value,
  onChange,
  style,
}: {
  value: string;
  onChange: (v: string) => void;
  style?: React.CSSProperties;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <input
        autoFocus
        defaultValue={value}
        onBlur={(e) => {
          onChange(e.target.value);
          setEditing(false);
        }}
        style={{
          background: "transparent",
          border: "none",
          outline: "none",
          color: "#E6E6E6",
          fontSize: "0.85rem",
          fontWeight: 600,
          textAlign: "center",
          width: "80%",
          ...style,
        }}
      />
    );
  }
  return (
    <Typography
      onDoubleClick={() => setEditing(true)}
      sx={{
        fontSize: "0.85rem",
        fontWeight: 600,
        color: "#E6E6E6",
        userSelect: "none",
        cursor: "text",
        wordBreak: "break-word",
        textAlign: "center",
        px: 1,
        lineHeight: 1.2,
        ...style,
      }}
    >
      {value}
    </Typography>
  );
}

export default function ShapeNode({ data, selected }: NodeProps) {
  const nodeData = data as ShapeNodeData;
  const color = nodeData.color || "rgba(100,181,246,0.22)";
  const borderColor = selected ? "#D4AF37" : (nodeData.color || "rgba(100,181,246,0.7)");

  // Hacky but works — mutate data directly, ReactFlow will pick it up
  const setLabel = (v: string) => { nodeData.label = v; };

  if (nodeData.shape === "diamond") {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          minWidth: 90,
          minHeight: 70,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <NodeResizer isVisible={selected} minWidth={90} minHeight={70} />
        <Handle id="top" type="source" position={Position.Top} style={HANDLE_STYLE} />
        <Handle id="bottom" type="source" position={Position.Bottom} style={HANDLE_STYLE} />
        <Handle id="left" type="source" position={Position.Left} style={HANDLE_STYLE} />
        <Handle id="right" type="source" position={Position.Right} style={HANDLE_STYLE} />

        {/* SVG diamond that fills node bounds */}
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
          <EditableLabel value={nodeData.label || ""} onChange={setLabel} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minWidth: 70,
        minHeight: 50,
        bgcolor: color,
        border: "2px solid",
        borderColor,
        borderRadius: nodeData.shape === "circle" ? "50%" : "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: selected ? "0 0 0 2px #D4AF37" : "0 4px 12px rgba(0,0,0,0.3)",
        transition: "all 0.2s",
        cursor: "default",
        overflow: "hidden",
      }}
    >
      <NodeResizer isVisible={selected} minWidth={70} minHeight={50} />
      <Handle id="top" type="source" position={Position.Top} style={HANDLE_STYLE} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={HANDLE_STYLE} />
      <Handle id="left" type="source" position={Position.Left} style={HANDLE_STYLE} />
      <Handle id="right" type="source" position={Position.Right} style={HANDLE_STYLE} />
      <EditableLabel value={nodeData.label || ""} onChange={setLabel} />
    </Box>
  );
}
