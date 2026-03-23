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

interface FolderTreeItemProps {
  folder: Folder;
  allFolders: Folder[];
  documents: DocumentSummary[];
  depth?: number;
}

export default function FolderTreeItem({
  folder,
  allFolders,
  documents,
  depth = 0,
}: FolderTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const childFolders = allFolders.filter((f) => f.parentID === folder.id);
  const folderDocs = documents.filter((d) => d.folderID === folder.id);
  const hasChildren = childFolders.length > 0 || folderDocs.length > 0;

  return (
    <Box sx={{ pl: depth > 0 ? 1.5 : 0 }}>
      {/* Folder header */}
      <Box
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
          "&:hover": {
            bgcolor: "rgba(212, 175, 55, 0.06)",
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
      </Box>

      {/* Children */}
      {isExpanded && (
        <Box
          sx={{
            ml: 1,
            pl: 1,
            borderLeft: "1px solid rgba(212, 175, 55, 0.08)",
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
            />
          ))}

          {/* Documents in this folder */}
          {folderDocs.map((doc) => (
            <DocumentItem key={doc.id} document={doc} />
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
