"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Connection,
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
import Box from "@mui/material/Box";

interface WhiteboardProps {
  initialContent?: Record<string, unknown>;
}

const DEFAULT_EDGE_OPTIONS = {
  style: { stroke: "rgba(212, 175, 55, 0.5)", strokeWidth: 1.5 },
  markerEnd: { type: MarkerType.ArrowClosed, color: "rgba(212, 175, 55, 0.5)" },
};

function WhiteboardCanvas({ initialContent }: WhiteboardProps) {
  const params = useParams();
  const campaignId = params.id as string;
  const docId = params.docId as string;
  const updateDocument = useUpdateDocument();
  const { data: documents, isLoading: isLoadingDocs } = useDocuments(campaignId);

  const [pickerOpen, setPickerOpen] = useState(false);

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
      setEdges((eds) => {
        const newEdges = addEdge({ ...params, ...DEFAULT_EDGE_OPTIONS }, eds);
        debouncedSave(nodes, newEdges);
        return newEdges;
      });
    },
    [setEdges, nodes, debouncedSave],
  );

  const handleAddDocumentCard = useCallback(
    (doc: DocumentSummary) => {
      const newNode: Node = {
        id: `documentCard-${Date.now()}`,
        type: "documentCard",
        position: { x: 100, y: 100 },
        data: {
          docId: doc.id,
          title: doc.title,
          preview: "",
        },
      };
      setNodes((nds) => {
        const updated = [...nds, newNode];
        debouncedSave(updated, edges);
        return updated;
      });
    },
    [setNodes, edges, debouncedSave],
  );

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      <DocumentPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        documents={documents ?? []}
        isLoading={isLoadingDocs}
        onSelect={handleAddDocumentCard}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
        fitView
        proOptions={{ hideAttribution: true }}
        style={{ background: "transparent" }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(255,255,255,0.06)"
        />
        <Controls
          style={{
            background: "rgba(13, 17, 23, 0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
          }}
        />
        <MiniMap
          style={{
            background: "rgba(13, 17, 23, 0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
          }}
          maskColor="rgba(0,0,0,0.5)"
        />
        <WhiteboardToolbar onAddDocumentCard={() => setPickerOpen(true)} />
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
