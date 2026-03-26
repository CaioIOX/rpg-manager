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
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import useUpdateDocument from "@/lib/hooks/useUpdateDocument";
import useDocuments from "@/lib/hooks/useDocuments";
import WhiteboardToolbar from "./WhiteboardToolbar";
import DocumentPickerDialog from "./DocumentPickerDialog";
import WhiteboardContextMenu, { ContextMenuState } from "./WhiteboardContextMenu";
import { nodeTypes } from "./nodes";
import { DocumentSummary } from "@/lib/types/Documents";
import { WhiteboardMode } from "./types";
import Box from "@mui/material/Box";

interface WhiteboardProps {
  initialContent?: Record<string, unknown>;
}

function edgeOpts(arrow: boolean) {
  return {
    style: { stroke: "rgba(212,175,55,0.7)", strokeWidth: 2 },
    markerEnd: arrow ? { type: MarkerType.ArrowClosed, color: "rgba(212,175,55,0.7)", width: 14, height: 14 } : undefined,
  };
}

function WhiteboardCanvas({ initialContent }: WhiteboardProps) {
  const params = useParams();
  const campaignId = params.id as string;
  const docId = params.docId as string;
  const updateDocument = useUpdateDocument();
  const { data: docs, isLoading: loadingDocs } = useDocuments(campaignId);
  const { screenToFlowPosition, getNodes, addNodes, setNodes: rfSetNodes, setEdges: rfSetEdges, getEdges } = useReactFlow();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [mode, setMode] = useState<WhiteboardMode>("grab");
  const [arrowEdges, setArrowEdges] = useState(false);
  const [ctxMenu, setCtxMenu] = useState<ContextMenuState | null>(null);
  const clipboard = useRef<Node[]>([]);

  const rawNodes: Node[] = Array.isArray(initialContent?.nodes) ? (initialContent.nodes as Node[]) : [];
  const rawEdges: Edge[] = Array.isArray(initialContent?.edges) ? (initialContent.edges as Edge[]) : [];
  const [nodes, setNodes, onNodesChange] = useNodesState(rawNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(rawEdges);

  const debouncedSave = useDebouncedCallback((n: Node[], e: Edge[]) => {
    updateDocument.mutate({ campaignId, documentId: docId, content: { nodes: n, edges: e } });
  }, 1400);

  // Auto-save on any change
  useEffect(() => {
    debouncedSave(nodes, edges);
  }, [nodes, edges]);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({ ...params, ...edgeOpts(arrowEdges) }, eds));
  }, [setEdges, arrowEdges]);

  // Text mode: click canvas to place a text node
  const handlePaneClick = useCallback((e: React.MouseEvent) => {
    if (mode !== "text") return;
    const pos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    addNodes({ id: `text-${Date.now()}`, type: "text", position: { x: pos.x - 80, y: pos.y - 20 }, data: { html: "" } });
  }, [mode, screenToFlowPosition, addNodes]);

  // Right-click on pane
  const handlePaneCtx = useCallback((e: MouseEvent | React.MouseEvent) => {
    e.preventDefault();
    const selected = getNodes().filter((n) => n.selected);
    setCtxMenu({ x: (e as MouseEvent).clientX ?? (e as React.MouseEvent).clientX, y: (e as MouseEvent).clientY ?? (e as React.MouseEvent).clientY, nodeIds: selected.map((n) => n.id), edgeIds: [] });
  }, [getNodes]);

  // Right-click on node
  const handleNodeCtx = useCallback((e: React.MouseEvent, node: Node) => {
    e.preventDefault();
    const selected = getNodes().filter((n) => n.selected);
    const ids = selected.length > 0 ? selected.map((n) => n.id) : [node.id];
    setCtxMenu({ x: e.clientX, y: e.clientY, nodeIds: ids, edgeIds: [] });
  }, [getNodes]);

  // ── Group selected nodes ──────────────────────────────────────────────────
  const handleGroup = useCallback(() => {
    const all = getNodes();
    const selected = all.filter((n) => ctxMenu?.nodeIds.includes(n.id) && n.type !== "group");
    if (selected.length < 2) return;
    const xs = selected.map((n) => n.position.x);
    const ys = selected.map((n) => n.position.y);
    const x2s = selected.map((n) => n.position.x + (n.measured?.width ?? 200));
    const y2s = selected.map((n) => n.position.y + (n.measured?.height ?? 100));
    const pad = 20;
    const gx = Math.min(...xs) - pad;
    const gy = Math.min(...ys) - pad;
    const gw = Math.max(...x2s) - Math.min(...xs) + pad * 2;
    const gh = Math.max(...y2s) - Math.min(...ys) + pad * 2;
    const gid = `group-${Date.now()}`;
    const groupNode: Node = { id: gid, type: "group", position: { x: gx, y: gy }, style: { width: gw, height: gh }, data: { label: "" }, zIndex: -1 };
    setNodes((nds) => [
      groupNode,
      ...nds.map((n) =>
        selected.find((s) => s.id === n.id)
          ? { ...n, parentId: gid, extent: "parent" as const, position: { x: n.position.x - gx, y: n.position.y - gy } }
          : n,
      ),
    ]);
  }, [getNodes, setNodes, ctxMenu]);

  // ── Ungroup ───────────────────────────────────────────────────────────────
  const handleUngroup = useCallback(() => {
    const all = getNodes();
    const groups = all.filter((n) => n.type === "group" && ctxMenu?.nodeIds.includes(n.id));
    if (groups.length === 0) return;
    const gids = new Set(groups.map((g) => g.id));
    setNodes((nds) =>
      nds
        .filter((n) => !gids.has(n.id))
        .map((n) => {
          if (!n.parentId || !gids.has(n.parentId)) return n;
          const parent = groups.find((g) => g.id === n.parentId)!;
          return { ...n, parentId: undefined, extent: undefined, position: { x: parent.position.x + n.position.x, y: parent.position.y + n.position.y } };
        }),
    );
  }, [getNodes, setNodes, ctxMenu]);

  // ── Copy / Cut / Duplicate ────────────────────────────────────────────────
  const handleCopy = useCallback(() => {
    clipboard.current = getNodes().filter((n) => ctxMenu?.nodeIds.includes(n.id));
  }, [getNodes, ctxMenu]);

  const handleCut = useCallback(() => {
    handleCopy();
    setNodes((nds) => nds.filter((n) => !ctxMenu?.nodeIds.includes(n.id)));
    setEdges((eds) => eds.filter((e) => !ctxMenu?.nodeIds.includes(e.source) && !ctxMenu?.nodeIds.includes(e.target)));
  }, [handleCopy, setNodes, setEdges, ctxMenu]);

  const handleDuplicate = useCallback(() => {
    const selected = getNodes().filter((n) => ctxMenu?.nodeIds.includes(n.id));
    const newNodes = selected.map((n) => ({ ...n, id: `${n.type}-${Date.now()}-${Math.random().toString(36).slice(2)}`, position: { x: n.position.x + 24, y: n.position.y + 24 }, selected: false }));
    addNodes(newNodes);
  }, [getNodes, addNodes, ctxMenu]);

  // ── Delete selected ───────────────────────────────────────────────────────
  const handleDelete = useCallback(() => {
    setNodes((nds) => nds.filter((n) => !ctxMenu?.nodeIds.includes(n.id)));
    setEdges((eds) => eds.filter((e) => !ctxMenu?.edgeIds.includes(e.id)));
  }, [setNodes, setEdges, ctxMenu]);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const editable = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable;
      if (editable) return;
      if (e.key === "v" || e.key === "V") setMode("select");
      if (e.key === "g" || e.key === "G") setMode("grab");
      if (e.key === "t" || e.key === "T") setMode("text");
      if (e.key === "Escape") { setMode("grab"); setCtxMenu(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hasGroup = !!ctxMenu && getNodes().some((n) => n.type === "group" && ctxMenu.nodeIds.includes(n.id));

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative", cursor: mode === "text" ? "crosshair" : mode === "grab" ? "grab" : "default" }}>
      <DocumentPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        documents={docs ?? []}
        isLoading={loadingDocs}
        onSelect={(doc: DocumentSummary) => {
          const pos = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
          addNodes({ id: `documentCard-${Date.now()}`, type: "documentCard", position: { x: pos.x - 110, y: pos.y - 60 }, data: { docId: doc.id, title: doc.title } });
        }}
      />

      <WhiteboardContextMenu
        menu={ctxMenu}
        onClose={() => setCtxMenu(null)}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onCopy={handleCopy}
        onCut={handleCut}
        onGroup={handleGroup}
        onUngroup={handleUngroup}
        hasGroup={hasGroup}
      />

      <style>{`
        .react-flow__handle { width:12px!important;height:12px!important;background:#4dabf7!important;border:2px solid #fff!important;border-radius:50%!important;opacity:0!important;transition:opacity .15s,transform .15s!important;z-index:20!important; }
        .react-flow__node:hover .react-flow__handle,.react-flow__node.selected .react-flow__handle{opacity:1!important;}
        .react-flow__handle:hover{transform:scale(1.5)!important;background:#228be6!important;opacity:1!important;}
        .react-flow__controls button{background:#ffffff!important;border-bottom:1px solid #ddd!important;}
        .react-flow__controls button svg{fill:#333!important;}
        .react-flow__controls button:hover{background:#f0f0f0!important;}
        .react-flow__edge-path{stroke:rgba(212,175,55,0.7)!important;stroke-width:2px!important;}
        .react-flow__connection-line{stroke:rgba(212,175,55,0.9)!important;stroke-width:2px!important;}
        .react-flow__selection{background:rgba(212,175,55,0.06)!important;border:1px solid rgba(212,175,55,0.45)!important;}
        .react-flow__resize-control.line{border-color:rgba(212,175,55,0.5)!important;}
        .react-flow__resize-control.handle{background:#D4AF37!important;border:none!important;width:7px!important;height:7px!important;border-radius:2px!important;}
      `}</style>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={handlePaneClick}
        onPaneContextMenu={handlePaneCtx}
        onNodeContextMenu={handleNodeCtx}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        isValidConnection={() => true}
        selectionMode={SelectionMode.Partial}
        panOnDrag={mode === "grab"}
        selectionOnDrag={mode === "select"}
        multiSelectionKeyCode="Shift"
        deleteKeyCode={["Delete", "Backspace"]}
        zoomOnScroll
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
