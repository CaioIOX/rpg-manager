"use client";

import { NodeProps, Handle, Position, NodeResizer } from "@xyflow/react";
import Box from "@mui/material/Box";
import MiniToolbar from "../MiniToolbar";
import { useEffect, useRef, useState } from "react";

export type TextNodeData = { html: string };

export default function TextNode({ data, selected }: NodeProps) {
  const nodeData = data as TextNodeData;
  const [editing, setEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing && editorRef.current) {
      editorRef.current.innerHTML = nodeData.html || "";
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
      editorRef.current.focus();
    }
  }, [editing]);

  const handleBlur = () => {
    nodeData.html = editorRef.current?.innerHTML ?? "";
    setEditing(false);
  };

  const hs = { zIndex: 20 };
  return (
    <Box ref={anchorRef} sx={{ width: "100%", height: "100%", minWidth: 80, minHeight: 32, display: "flex", flexDirection: "column", position: "relative" }}>
      <NodeResizer isVisible={selected} minWidth={80} minHeight={32} />
      <Handle id="top" type="target" position={Position.Top} style={hs} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={hs} />
      <Handle id="left" type="target" position={Position.Left} style={hs} />
      <Handle id="right" type="source" position={Position.Right} style={hs} />

      {editing && <MiniToolbar editorRef={editorRef} anchorRef={anchorRef} />}

      {editing ? (
        <Box
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          sx={{ flex: 1, outline: "none", color: "#E6E6E6", fontSize: "1rem", lineHeight: 1.5, wordBreak: "break-word", caretColor: "#D4AF37", px: 0.5, "& ul": { pl: 2.5 } }}
        />
      ) : (
        <Box
          onDoubleClick={() => setEditing(true)}
          sx={{ flex: 1, color: "#E6E6E6", fontSize: "1rem", lineHeight: 1.5, wordBreak: "break-word", cursor: "text", userSelect: "none", border: selected ? "1px dashed rgba(212,175,55,0.4)" : "1px dashed transparent", borderRadius: "4px", px: 0.5, "& ul": { pl: 2.5 } }}
          dangerouslySetInnerHTML={{ __html: nodeData.html || '<span style="opacity:0.3;font-size:0.9rem">Duplo clique para editar...</span>' }}
        />
      )}
    </Box>
  );
}
