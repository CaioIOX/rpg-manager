"use client";

import { NodeProps, NodeResizer, Handle, Position } from "@xyflow/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function GroupNode({ data, selected }: NodeProps) {
  return (
    <Box
      sx={{
        width: "100%", height: "100%", minWidth: 100, minHeight: 80,
        border: "2px dashed",
        borderColor: selected ? "rgba(212,175,55,0.7)" : "rgba(212,175,55,0.28)",
        borderRadius: "14px",
        bgcolor: "rgba(212,175,55,0.04)",
        position: "relative",
        backdropFilter: "blur(2px)",
      }}
    >
      <NodeResizer isVisible={selected} minWidth={100} minHeight={80} />
      <Handle id="top" type="target" position={Position.Top} style={{ zIndex: 20 }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ zIndex: 20 }} />
      <Handle id="left" type="target" position={Position.Left} style={{ zIndex: 20 }} />
      <Handle id="right" type="source" position={Position.Right} style={{ zIndex: 20 }} />
      {(data as any).label && (
        <Typography variant="caption" sx={{ position: "absolute", top: 6, left: 10, color: "rgba(212,175,55,0.7)", fontSize: "0.7rem", fontWeight: 600, userSelect: "none" }}>
          {String((data as any).label)}
        </Typography>
      )}
    </Box>
  );
}
