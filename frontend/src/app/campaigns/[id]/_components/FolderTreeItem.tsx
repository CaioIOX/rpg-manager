"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import { Folder } from "@/lib/types/Folder";
import { DocumentSummary } from "@/lib/types/Documents";
import DocumentItem from "./DocumentItem";
import useUpdateDocument from "@/lib/hooks/useUpdateDocument";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MouseEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface FolderTreeItemProps {
  folder: Folder;
  allFolders: Folder[];
  documents: DocumentSummary[];
  depth?: number;
  onEditFolder?: (f: Folder) => void;
  onDeleteFolder?: (f: Folder) => void;
  onEditDoc?: (d: DocumentSummary) => void;
  onDeleteDoc?: (d: DocumentSummary) => void;
  onNavigate?: () => void;
}

export default function FolderTreeItem({
  folder,
  allFolders,
  documents,
  depth = 0,
  onEditFolder,
  onDeleteFolder,
  onEditDoc,
  onDeleteDoc,
  onNavigate,
}: FolderTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const updateDocument = useUpdateDocument();
  const queryClient = useQueryClient();
  
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = (event?: MouseEvent<HTMLElement>) => {
    if (event) event.stopPropagation();
    setMenuAnchor(null);
  };

  const childFolders = allFolders.filter((f) => f.parent_id === folder.id);
  const folderDocs = documents.filter((d) => d.folder_id === folder.id);
  const hasChildren = childFolders.length > 0 || folderDocs.length > 0;

  return (
    <Box sx={{ pl: depth > 0 ? 1.5 : 0 }}>
      {/* Folder header */}
      <Box
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const docId = e.dataTransfer.getData("documentId");
          if (docId) {
            updateDocument.mutate({
              campaignId: folder.campaign_id,
              documentId: docId,
              folderID: folder.id,
            }, {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["documents", folder.campaign_id] });
              }
            });
          }
        }}
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 1,
          py: 0.6,
          borderRadius: "10px",
          cursor: "pointer",
          transition: "all 0.15s ease",
          bgcolor: isDragOver ? "rgba(212, 175, 55, 0.15)" : "transparent",
          border: isDragOver ? "1px dashed rgba(212, 175, 55, 0.5)" : "1px dashed transparent",
          "&:hover": {
            bgcolor: "rgba(212, 175, 55, 0.06)",
            "& .folder-actions": {
              opacity: 1,
            },
          },
        }}
      >
        <IconButton
          size="small"
          sx={{
            p: 0.2,
            color: "text.secondary",
            transition: "transform 0.2s ease",
          }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ExpandMoreIcon sx={{ fontSize: "1rem" }} />
            ) : (
              <ChevronRightIcon sx={{ fontSize: "1rem" }} />
            )
          ) : (
            <Box sx={{ width: "1rem" }} />
          )}
        </IconButton>
        {isExpanded ? (
          <FolderOpenIcon
            sx={{ fontSize: "1rem", color: "#D4AF37", flexShrink: 0 }}
          />
        ) : (
          <FolderIcon
            sx={{ fontSize: "1rem", color: "#D4AF37", opacity: 0.7, flexShrink: 0 }}
          />
        )}
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.83rem",
            fontWeight: 600,
            color: "text.primary",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {folder.name}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontSize: "0.65rem",
            opacity: 0.6,
            flexShrink: 0,
          }}
        >
          {folderDocs.length}
        </Typography>

        {(onEditFolder || onDeleteFolder) && (
          <IconButton
            className="folder-actions"
            size="small"
            onClick={handleMenuOpen}
            sx={{
              ml: 1,
              p: 0.2,
              opacity: { xs: 1, md: menuAnchor ? 1 : 0 },
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
          {onEditFolder && (
            <MenuItem
              onClick={(e) => {
                handleMenuClose(e);
                onEditFolder(folder);
              }}
              sx={{ fontSize: "0.85rem" }}
            >
              Editar
            </MenuItem>
          )}
          {onDeleteFolder && (
            <MenuItem
              onClick={(e) => {
                handleMenuClose(e);
                onDeleteFolder(folder);
              }}
              sx={{ fontSize: "0.85rem", color: "error.main" }}
            >
              Apagar
            </MenuItem>
          )}
        </Menu>
      </Box>

      {/* Children */}
      {isExpanded && (
        <Box
          sx={{
            ml: 2.2,
            pl: 1.2,
            borderLeft: "2px solid rgba(212, 175, 55, 0.15)",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {/* Nested folders */}
          {childFolders.map((childFolder) => (
            <FolderTreeItem
              key={childFolder.id}
              folder={childFolder}
              allFolders={allFolders}
              documents={documents}
              depth={depth + 1}
              onEditFolder={onEditFolder}
              onDeleteFolder={onDeleteFolder}
              onEditDoc={onEditDoc}
              onDeleteDoc={onDeleteDoc}
              onNavigate={onNavigate}
            />
          ))}

          {/* Documents in this folder */}
          {folderDocs.map((doc) => (
            <DocumentItem 
              key={doc.id} 
              document={doc} 
              onEdit={() => onEditDoc?.(doc)}
              onDelete={() => onDeleteDoc?.(doc)}
              onNavigate={onNavigate}
            />
          ))}

          {/* Empty folder message */}
          {folderDocs.length === 0 && childFolders.length === 0 && (
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                pl: 2,
                py: 0.5,
                display: "block",
                fontSize: "0.75rem",
                fontStyle: "italic",
                opacity: 0.6,
              }}
            >
              Pasta vazia
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
