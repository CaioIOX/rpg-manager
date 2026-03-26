"use client";

import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import ChangeHistoryOutlinedIcon from "@mui/icons-material/ChangeHistoryOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import PanToolOutlinedIcon from "@mui/icons-material/PanToolOutlined";
import TitleIcon from "@mui/icons-material/Title";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { WhiteboardMode } from "./types";

interface WhiteboardToolbarProps {
  mode: WhiteboardMode;
  onModeChange: (m: WhiteboardMode) => void;
  arrowEdges: boolean;
  onArrowEdgesChange: (v: boolean) => void;
  onAddDocumentCard: () => void;
}

function Sep() {
  return (
    <Divider
      orientation="vertical"
      flexItem
      sx={{ mx: 0.5, borderColor: "rgba(255,255,255,0.1)" }}
    />
  );
}

function ToolBtn({
  label,
  icon,
  active,
  shortcut,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  shortcut?: string;
  onClick: () => void;
}) {
  return (
    <Tooltip
      title={
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="caption" display="block">{label}</Typography>
          {shortcut && (
            <Typography variant="caption" sx={{ opacity: 0.6, fontSize: "0.65rem" }}>
              {shortcut}
            </Typography>
          )}
        </Box>
      }
      placement="bottom"
    >
      <IconButton
        size="small"
        onClick={onClick}
        sx={{
          color: active ? "#D4AF37" : "rgba(200,200,200,0.7)",
          borderRadius: "8px",
          bgcolor: active ? "rgba(212,175,55,0.12)" : "transparent",
          border: active ? "1px solid rgba(212,175,55,0.35)" : "1px solid transparent",
          transition: "all 0.15s",
          "&:hover": {
            color: "#D4AF37",
            bgcolor: "rgba(212,175,55,0.08)",
          },
        }}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
}

export default function WhiteboardToolbar({
  mode,
  onModeChange,
  arrowEdges,
  onArrowEdgesChange,
  onAddDocumentCard,
}: WhiteboardToolbarProps) {
  const { addNodes, screenToFlowPosition } = useReactFlow();

  const addCentered = useCallback(
    (type: string, data: Record<string, unknown>, offsetX = 60, offsetY = 60) => {
      const pos = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      addNodes({
        id: `${type}-${Date.now()}`,
        type,
        position: { x: pos.x - offsetX, y: pos.y - offsetY },
        data,
      });
    },
    [addNodes, screenToFlowPosition],
  );

  return (
    <Box
      sx={{
        position: "absolute",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 0.5,
        zIndex: 100,
        bgcolor: "rgba(10, 10, 14, 0.96)",
        border: "1px solid rgba(212, 175, 55, 0.24)",
        borderRadius: "16px",
        px: 1.5,
        py: 1,
        maxWidth: "92vw",
        width: "auto",
        backdropFilter: "blur(14px)",
        boxShadow: "0 10px 32px rgba(0,0,0,0.6)",
        userSelect: "none",
        "& .MuiDivider-root": {
           display: { xs: "none", sm: "block" } // Hide dividers on very small screens to save space
        }
      }}
    >
      {/* Mode buttons */}
      <ToolBtn
        label="Selecionar"
        shortcut="V"
        icon={<NearMeOutlinedIcon sx={{ fontSize: 22 }} />}
        active={mode === "select"}
        onClick={() => onModeChange("select")}
      />
      <ToolBtn
        label="Mover canvas"
        shortcut="G"
        icon={<PanToolOutlinedIcon sx={{ fontSize: 22 }} />}
        active={mode === "grab"}
        onClick={() => onModeChange("grab")}
      />
      <ToolBtn
        label="Texto (clique no canvas)"
        shortcut="T"
        icon={<TitleIcon sx={{ fontSize: 22 }} />}
        active={mode === "text"}
        onClick={() => onModeChange("text")}
      />

      <Sep />

      {/* Node types */}
      <ToolBtn
        label="Post-it"
        icon={<NoteAltOutlinedIcon sx={{ fontSize: 22 }} />}
        onClick={() => addCentered("stickyNote", { text: "", color: "#F9E04B" }, 100, 70)}
      />
      <ToolBtn
        label="Texto Livre"
        icon={<TextFieldsIcon sx={{ fontSize: 22 }} />}
        onClick={() => addCentered("text", { html: "" }, 80, 20)}
      />
      <ToolBtn
        label="Vincular Documento"
        icon={<DescriptionOutlinedIcon sx={{ fontSize: 22 }} />}
        onClick={onAddDocumentCard}
      />

      <Sep />

      <ToolBtn
        label="Retângulo"
        icon={<CropSquareIcon sx={{ fontSize: 22 }} />}
        onClick={() => addCentered("shape", { label: "", shape: "rectangle", color: "rgba(100,181,246,0.18)" }, 70, 40)}
      />
      <ToolBtn
        label="Círculo"
        icon={<CircleOutlinedIcon sx={{ fontSize: 22 }} />}
        onClick={() => addCentered("shape", { label: "", shape: "circle", color: "rgba(129,199,132,0.18)" }, 60, 60)}
      />
      <ToolBtn
        label="Losango"
        icon={<ChangeHistoryOutlinedIcon sx={{ fontSize: 22 }} />}
        onClick={() => addCentered("shape", { label: "", shape: "diamond", color: "rgba(206,147,216,0.18)" }, 70, 50)}
      />

      <Sep />

      {/* Edge type */}
      <ToolBtn
        label="Conexão: Linha"
        icon={<HorizontalRuleIcon sx={{ fontSize: 22 }} />}
        active={!arrowEdges}
        onClick={() => onArrowEdgesChange(false)}
      />
      <ToolBtn
        label="Conexão: Seta"
        icon={<ArrowForwardIcon sx={{ fontSize: 22 }} />}
        active={arrowEdges}
        onClick={() => onArrowEdgesChange(true)}
      />
    </Box>
  );
}
