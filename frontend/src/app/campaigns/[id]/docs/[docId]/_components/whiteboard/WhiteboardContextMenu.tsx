"use client";

import { createPortal } from "react-dom";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

export interface ContextMenuState {
  x: number;
  y: number;
  nodeIds: string[];
  edgeIds: string[];
}

interface Props {
  menu: ContextMenuState | null;
  onClose: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  hasGroup: boolean;
  hasClipboard: boolean;
}

const itemSx = {
  fontSize: "0.82rem",
  py: 0.6,
  px: 1.5,
  gap: 1,
  borderRadius: "6px",
  "&:hover": { bgcolor: "rgba(212,175,55,0.1)", color: "#E8CC6E" },
};

export default function WhiteboardContextMenu({ menu, onClose, onDelete, onDuplicate, onCopy, onCut, onPaste, onGroup, onUngroup, hasGroup, hasClipboard }: Props) {
  if (!menu || typeof document === "undefined") return null;

  const hasNodes = menu.nodeIds.length > 0;
  const multi = menu.nodeIds.length > 1;

  return createPortal(
    <>
      {/* backdrop */}
      <Box sx={{ position: "fixed", inset: 0, zIndex: 99997 }} onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />

      <Box
        sx={{
          position: "fixed",
          top: menu.y,
          left: menu.x,
          zIndex: 99998,
          bgcolor: "rgba(12,12,16,0.97)",
          border: "1px solid rgba(212,175,55,0.2)",
          borderRadius: "10px",
          py: 0.5,
          px: 0.5,
          minWidth: 176,
          boxShadow: "0 8px 28px rgba(0,0,0,0.7)",
          backdropFilter: "blur(12px)",
        }}
      >
        {hasNodes && (
          <>
            <MenuItem onClick={() => { onCopy(); onClose(); }} sx={itemSx}>Copiar</MenuItem>
            <MenuItem onClick={() => { onCut(); onClose(); }} sx={itemSx}>Recortar</MenuItem>
            <MenuItem onClick={() => { onDuplicate(); onClose(); }} sx={itemSx}>Duplicar</MenuItem>
            <MenuItem 
              disabled={!hasClipboard}
              onClick={() => { onPaste(); onClose(); }} 
              sx={{ ...itemSx, opacity: hasClipboard ? 1 : 0.5 }}
            >
              Colar
            </MenuItem>
            <Divider sx={{ my: 0.4, borderColor: "rgba(255,255,255,0.08)" }} />
            {multi && (
              <MenuItem onClick={() => { onGroup(); onClose(); }} sx={itemSx}>Agrupar seleção</MenuItem>
            )}
            {hasGroup && (
              <MenuItem onClick={() => { onUngroup(); onClose(); }} sx={itemSx}>Desagrupar</MenuItem>
            )}
            {(multi || hasGroup) && <Divider sx={{ my: 0.4, borderColor: "rgba(255,255,255,0.08)" }} />}
            <MenuItem onClick={() => { onDelete(); onClose(); }} sx={{ ...itemSx, color: "rgba(248,81,73,0.85)", "&:hover": { bgcolor: "rgba(248,81,73,0.08)", color: "#F85149" } }}>
              Apagar
            </MenuItem>
          </>
        )}
        {!hasNodes && (
          <>
            <MenuItem 
              disabled={!hasClipboard}
              onClick={() => { onPaste(); onClose(); }} 
              sx={{ ...itemSx, opacity: hasClipboard ? 1 : 0.5 }}
            >
              Colar
            </MenuItem>
            {!hasClipboard && (
              <Typography variant="caption" sx={{ display: "block", px: 1.5, py: 0.5, color: "text.secondary" }}>
                Clique em um objeto para opções
              </Typography>
            )}
          </>
        )}
      </Box>
    </>,
    document.body,
  );
}
