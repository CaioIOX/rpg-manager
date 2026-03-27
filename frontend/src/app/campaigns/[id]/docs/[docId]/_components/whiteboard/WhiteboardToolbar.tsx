"use client";

import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import ChangeHistoryOutlinedIcon from "@mui/icons-material/ChangeHistoryOutlined";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

interface WhiteboardToolbarProps {
  onAddDocumentCard: () => void;
}

export default function WhiteboardToolbar({ onAddDocumentCard }: WhiteboardToolbarProps) {
  const { addNodes, screenToFlowPosition } = useReactFlow();

  const getCenterPosition = useCallback(() => {
    return screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }, [screenToFlowPosition]);

  const addNode = useCallback(
    (type: string, data: Record<string, unknown>) => {
      const position = getCenterPosition();
      addNodes({
        id: `${type}-${Date.now()}`,
        type,
        position: { x: position.x - 60, y: position.y - 60 },
        data,
      });
    },
    [addNodes, getCenterPosition],
  );

  const tools = [
    {
      label: "Post-it",
      icon: <NoteAltOutlinedIcon fontSize="small" />,
      onClick: () => addNode("stickyNote", { text: "", color: "#F9E04B" }),
    },
    {
      label: "Texto Livre",
      icon: <TextFieldsIcon fontSize="small" />,
      onClick: () => addNode("text", { text: "" }),
    },
    {
      label: "Card de Documento",
      icon: <DescriptionOutlinedIcon fontSize="small" />,
      onClick: onAddDocumentCard,
    },
    null, // divider
    {
      label: "Retângulo",
      icon: <CropSquareIcon fontSize="small" />,
      onClick: () =>
        addNode("shape", { label: "", shape: "rectangle", color: "rgba(100,181,246,0.2)" }),
    },
    {
      label: "Círculo",
      icon: <CircleOutlinedIcon fontSize="small" />,
      onClick: () =>
        addNode("shape", { label: "", shape: "circle", color: "rgba(129,199,132,0.2)" }),
    },
    {
      label: "Losango",
      icon: <ChangeHistoryOutlinedIcon fontSize="small" />,
      onClick: () =>
        addNode("shape", { label: "", shape: "diamond", color: "rgba(206,147,216,0.2)" }),
    },
  ];

  return (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        zIndex: 5,
        bgcolor: "rgba(13, 17, 23, 0.88)",
        border: "1px solid rgba(212, 175, 55, 0.18)",
        borderRadius: "14px",
        px: 1,
        py: 0.75,
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}
    >
      {tools.map((tool, i) =>
        tool === null ? (
          <Divider key={i} orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: "rgba(255,255,255,0.1)" }} />
        ) : (
          <Tooltip key={i} title={tool.label} placement="bottom">
            <IconButton
              size="small"
              onClick={tool.onClick}
              sx={{
                color: "text.secondary",
                borderRadius: "8px",
                transition: "all 0.15s",
                "&:hover": {
                  color: "#D4AF37",
                  bgcolor: "rgba(212, 175, 55, 0.1)",
                },
              }}
            >
              {tool.icon}
            </IconButton>
          </Tooltip>
        ),
      )}
    </Box>
  );
}
