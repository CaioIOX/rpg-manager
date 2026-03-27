"use client";

import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  Connection,
  ConnectionMode,
  SelectionMode,
  Edge,
  Node,
  BackgroundVariant,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import useUpdateDocument from "@/lib/hooks/useUpdateDocument";
import useDocuments from "@/lib/hooks/useDocuments";
import WhiteboardToolbar from "./WhiteboardToolbar";
import DocumentPickerDialog from "./DocumentPickerDialog";
import { nodeTypes } from "./nodes";
import { DocumentSummary } from "@/lib/types/Documents";
import { WhiteboardMode } from "./types";
import Box from "@mui/material/Box";

interface WhiteboardProps {
  initialContent?: Record<string, unknown>;
}

function buildEdgeOptions(arrow: boolean) {
  return {
    style: { stroke: "rgba(212, 175, 55, 0.65)", strokeWidth: 2 },
    markerEnd: arrow
      ? { type: MarkerType.ArrowClosed, color: "rgba(212,175,55,0.65)", width: 14, height: 14 }
      : undefined,
    animated: false,
  };
}

function WhiteboardCanvas({ initialContent }: WhiteboardProps) {
  const params = useParams();
  const campaignId = params.id as string;
  const docId = params.docId as string;
  const updateDocument = useUpdateDocument();
  const { data: documents, isLoading: isLoadingDocs } = useDocuments(campaignId);
  const { screenToFlowPosition, addNodes } = useReactFlow();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [mode, setMode] = useState<WhiteboardMode>("grab");
  const [arrowEdges, setArrowEdges] = useState(false);

  const rawNodes: Node[] = Array.isArray(initialContent?.nodes)
    ? (initialContent.nodes as Node[])
    : [];
  const rawEdges: Edge[] = Array.isArray(initialContent?.edges)
    ? (initialContent.edges as Edge[])
    : [];

  const [nodes, setNodes, onNodesChange] = useNodesState(rawNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(rawEdges);

  const debouncedSave = useDebouncedCallback(
    (currentNodes: Node[], currentEdges: Edge[]) => {
      updateDocument.mutate({
        campaignId,
        documentId: docId,
        content: { nodes: currentNodes, edges: currentEdges },
      });
    },
    1200,
  );

  const handleNodesChange = useCallback(
    (changes: Parameters<typeof onNodesChange>[0]) => {
      onNodesChange(changes);
      setNodes((nds) => {
        debouncedSave(nds, edges);
        return nds;
      });
    },
    [onNodesChange, edges, debouncedSave, setNodes],
  );

  const handleEdgesChange = useCallback(
    (changes: Parameters<typeof onEdgesChange>[0]) => {
      onEdgesChange(changes);
      setEdges((eds) => {
        debouncedSave(nodes, eds);
        return eds;
      });
    },
    [onEdgesChange, nodes, debouncedSave, setEdges],
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const opts = buildEdgeOptions(arrowEdges);
      setEdges((eds) => {
        const newEdges = addEdge({ ...params, ...opts }, eds);
        debouncedSave(nodes, newEdges);
        return newEdges;
      });
    },
    [setEdges, nodes, debouncedSave, arrowEdges],
  );

  const handleAddDocumentCard = useCallback(
    (doc: DocumentSummary) => {
      const pos = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      const newNode: Node = {
        id: `documentCard-${Date.now()}`,
        type: "documentCard",
        position: { x: pos.x - 110, y: pos.y - 60 },
        data: { docId: doc.id, title: doc.title, preview: "" },
      };
      setNodes((nds) => {
        const updated = [...nds, newNode];
        debouncedSave(updated, edges);
        return updated;
      });
    },
    [setNodes, edges, debouncedSave, screenToFlowPosition],
  );

  // Text mode: click on canvas to place a text node
  const handlePaneClick = useCallback(
    (event: React.MouseEvent) => {
      if (mode !== "text") return;
      const pos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode: Node = {
        id: `text-${Date.now()}`,
        type: "text",
        position: { x: pos.x - 80, y: pos.y - 20 },
        data: { html: "" },
      };
      addNodes(newNode);
    },
    [mode, screenToFlowPosition, addNodes],
  );

  // Keyboard shortcuts: V = select, G = grab, T = text, Escape = grab
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const isEditable =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (e.target as HTMLElement).isContentEditable;
      if (isEditable) return;
      if (e.key === "v" || e.key === "V") setMode("select");
      if (e.key === "g" || e.key === "G") setMode("grab");
      if (e.key === "t" || e.key === "T") setMode("text");
      if (e.key === "Escape") setMode("grab");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cursorStyle =
    mode === "text" ? "crosshair" : mode === "grab" ? "grab" : "default";

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative", cursor: cursorStyle }}>
      <DocumentPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        documents={documents ?? []}
        isLoading={isLoadingDocs}
        onSelect={handleAddDocumentCard}
      />

      {/* Global canvas CSS */}
      <style>{`
        /* Handles: hidden by default, shown on hover/select */
        .react-flow__handle {
          width: 12px !important;
          height: 12px !important;
          background: #4dabf7 !important;
          border: 2px solid #fff !important;
          border-radius: 50% !important;
          opacity: 0 !important;
          transition: opacity 0.15s, transform 0.15s !important;
          z-index: 10 !important;
        }
        .react-flow__node:hover .react-flow__handle,
        .react-flow__node.selected .react-flow__handle {
          opacity: 1 !important;
        }
        .react-flow__handle:hover {
          transform: scale(1.5) !important;
          background: #228be6 !important;
          opacity: 1 !important;
        }
        /* Controls: white background, dark icons */
        .react-flow__controls {
          border-radius: 10px !important;
          overflow: hidden !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
        }
        .react-flow__controls button {
          background: #ffffff !important;
          border-bottom: 1px solid #e0e0e0 !important;
        }
        .react-flow__controls button svg { fill: #333 !important; }
        .react-flow__controls button:hover { background: #f0f0f0 !important; }
        /* Edges */
        .react-flow__edge-path { stroke: rgba(212,175,55,0.65) !important; stroke-width: 2px !important; }
        .react-flow__connection-line { stroke: rgba(212,175,55,0.85) !important; stroke-width: 2px !important; }
        /* Selection box */
        .react-flow__selection { background: rgba(212,175,55,0.06) !important; border: 1px solid rgba(212,175,55,0.5) !important; }
        /* Resize handle lines */
        .react-flow__resize-control.line { border-color: rgba(212,175,55,0.6) !important; }
        .react-flow__resize-control.handle {
          background: #D4AF37 !important;
          border: none !important;
          width: 7px !important;
          height: 7px !important;
          border-radius: 2px !important;
        }
      `}</style>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        selectionMode={SelectionMode.Partial}
        panOnDrag={mode === "grab"}
        selectionOnDrag={mode === "select"}
        multiSelectionKeyCode="Shift"
        deleteKeyCode={["Delete", "Backspace"]}
        zoomOnScroll
        panOnScroll={false}
        fitView
        proOptions={{ hideAttribution: true }}
        style={{ background: "#000" }}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={1.2} color="rgba(255,255,255,0.12)" />
        <Controls showInteractive={false} />
        <WhiteboardToolbar
          mode={mode}
          onModeChange={setMode}
          arrowEdges={arrowEdges}
          onArrowEdgesChange={setArrowEdges}
          onAddDocumentCard={() => setPickerOpen(true)}
        />
      </ReactFlow>
    </Box>
  );
}

export default function Whiteboard(props: WhiteboardProps) {
  return (
    <ReactFlowProvider>
      <WhiteboardCanvas {...props} />
    </ReactFlowProvider>
  );
}
