"use client";

import { NodeProps, Handle, Position, NodeResizer } from "@xyflow/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export type TextNodeData = {
  text: string;
};

export default function TextNode({ data, selected }: NodeProps) {
  const nodeData = data as TextNodeData;
  const [editing, setEditing] = useState(false);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minWidth: 100,
        minHeight: 40,
        px: 1,
        py: 0.5,
        borderRadius: "6px",
        border: selected ? "1.5px solid #D4AF37" : "1.5px solid transparent",
        transition: "border-color 0.2s",
        overflow: "hidden",
      }}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={100}
        minHeight={40}
        lineStyle={{ border: "1px dashed rgba(212,175,55,0.7)" }}
        handleStyle={{ background: "#D4AF37", border: "none", width: 8, height: 8, borderRadius: 2 }}
      />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      {editing ? (
        <textarea
          autoFocus
          defaultValue={nodeData.text}
          onBlur={(e) => {
            nodeData.text = e.target.value;
            setEditing(false);
          }}
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            resize: "none",
            color: "#E6E6E6",
            fontSize: "1rem",
            fontFamily: "inherit",
            width: "100%",
            height: "100%",
          }}
        />
      ) : (
        <Typography
          onDoubleClick={() => setEditing(true)}
          sx={{
            color: "text.primary",
            fontSize: "1rem",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            cursor: "text",
            userSelect: "none",
          }}
        >
          {nodeData.text || "Duplo clique para editar"}
        </Typography>
      )}
    </Box>
  );
}
