"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useParams, useRouter } from "next/navigation";
import { useState, MouseEvent } from "react";
import { DocumentSummary } from "@/lib/types/Documents";

interface DocumentItemProps {
  document: DocumentSummary;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function DocumentItem({ document, onEdit, onDelete }: DocumentItemProps) {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  const docId = params.docId as string;
  const isActive = docId === document.id;

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = (event?: MouseEvent<HTMLElement>) => {
    if (event) event.stopPropagation();
    setMenuAnchor(null);
  };

  return (
    <Box
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("documentId", document.id);
      }}
      onClick={() => router.push(`/campaigns/${campaignId}/docs/${document.id}`)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 1.5,
        py: 0.7,
        borderRadius: "10px",
        cursor: "pointer",
        transition: "all 0.15s ease",
        bgcolor: isActive ? "rgba(212, 175, 55, 0.1)" : "transparent",
        borderLeft: isActive ? "2px solid" : "2px solid transparent",
        borderColor: isActive ? "primary.main" : "transparent",
        "&:hover": {
          bgcolor: isActive
            ? "rgba(212, 175, 55, 0.12)"
            : "rgba(212, 175, 55, 0.06)",
          "& .doc-actions": {
            opacity: 1,
          },
        },
      }}
    >
      <DescriptionOutlinedIcon
        sx={{
          fontSize: "1rem",
          color: isActive ? "primary.main" : "text.secondary",
          flexShrink: 0,
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color: isActive ? "primary.main" : "text.primary",
          fontSize: "0.83rem",
          fontWeight: isActive ? 600 : 500,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
        }}
      >
        {document.title}
      </Typography>
      {document.isSpoiler && (
        <LockOutlinedIcon
          sx={{
            fontSize: "0.85rem",
            color: "error.main",
            opacity: 0.7,
            flexShrink: 0,
          }}
        />
      )}
      {(onEdit || onDelete) && (
        <IconButton
          className="doc-actions"
          size="small"
          onClick={handleMenuOpen}
          sx={{
            ml: "auto",
            p: 0.2,
            opacity: menuAnchor ? 1 : 0,
            transition: "opacity 0.2s",
            color: "text.secondary",
            "&:hover": { opacity: 1, bgcolor: "rgba(212, 175, 55, 0.1)", color: "primary.main" },
          }}
        >
          <MoreVertIcon sx={{ fontSize: "1rem" }} />
        </IconButton>
      )}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => handleMenuClose()}
        sx={{
          "& .MuiPaper-root": {
            bgcolor: "background.paper",
            border: "1px solid rgba(212, 175, 55, 0.12)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.5)",
            borderRadius: "8px",
          },
        }}
      >
        {onEdit && (
          <MenuItem
            onClick={(e) => {
              handleMenuClose(e);
              onEdit();
            }}
            sx={{ fontSize: "0.85rem" }}
          >
            Editar
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem
            onClick={(e) => {
              handleMenuClose(e);
              onDelete();
            }}
            sx={{ fontSize: "0.85rem", color: "error.main" }}
          >
            Apagar
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}
