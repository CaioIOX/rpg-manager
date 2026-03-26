"use client";

import { NodeProps, Handle, Position, NodeResizer } from "@xyflow/react";
import Box from "@mui/material/Box";
import MiniToolbar from "../MiniToolbar";
import { useEffect, useRef, useState } from "react";

export type StickyNoteData = { html: string; color: string };

export default function StickyNoteNode({ data, selected }: NodeProps) {
  const nodeData = data as StickyNoteData;
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
    <Box
      ref={anchorRef}
      sx={{
        width: "100%", height: "100%", minWidth: 120, minHeight: 80,
        bgcolor: nodeData.color || "#F9E04B",
        borderRadius: "4px", p: 1.5,
        boxShadow: selected ? "0 0 0 2px #D4AF37, 0 4px 16px rgba(0,0,0,0.5)" : "2px 4px 12px rgba(0,0,0,0.4)",
        position: "relative", overflow: "hidden", transition: "box-shadow 0.2s",
        "&::before": { content: '""', position: "absolute", top: 0, right: 0, width: 0, height: 0, borderLeft: "16px solid transparent", borderBottom: "16px solid rgba(0,0,0,0.15)" },
      }}
    >
      <NodeResizer isVisible={selected} minWidth={120} minHeight={80} />
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
          sx={{ width: "100%", height: "calc(100% - 8px)", outline: "none", color: "rgba(0,0,0,0.82)", fontSize: "0.85rem", fontWeight: 500, lineHeight: 1.4, wordBreak: "break-word", caretColor: "#333", "& ul": { pl: 2 } }}
        />
      ) : (
        <Box
          onDoubleClick={() => setEditing(true)}
          sx={{ color: "rgba(0,0,0,0.82)", fontWeight: 500, fontSize: "0.85rem", lineHeight: 1.4, wordBreak: "break-word", cursor: "text", userSelect: "none", "& ul": { pl: 2 } }}
          dangerouslySetInnerHTML={{ __html: nodeData.html || '<span style="opacity:0.5">Duplo clique para editar...</span>' }}
        />
      )}
    </Box>
  );
}
