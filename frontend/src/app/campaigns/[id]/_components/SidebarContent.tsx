"use client";

import { DocumentSummary } from "@/lib/types/Documents";
import { Folder } from "@/lib/types/Folder";
import { Template } from "@/lib/types/Template";
import { MapSummary } from "@/lib/types/Map";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MapIcon from "@mui/icons-material/Map";
import {
  Box,
  Collapse,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DocumentItem from "./DocumentItem";
import FolderTreeItem from "./FolderTreeItem";

interface SidebarContentProps {
  searchQuery: string;
  searchResults?: DocumentSummary[];
  templates?: Template[];
  rootFolders: Folder[];
  allFolders: Folder[];
  rootDocuments: DocumentSummary[];
  allDocuments: DocumentSummary[];
  activeTemplateId: string | null;
  templateMenuAnchor: HTMLElement | null;
  onTemplateMenuOpen: (
    event: MouseEvent<HTMLElement>,
    templateId: string,
  ) => void;
  onTemplateMenuClose: () => void;
  onEditFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;
  onEditDoc: (doc: DocumentSummary) => void;
  onDeleteDoc: (doc: DocumentSummary) => void;
  onEditTemplate: (template: Template) => void;
  onDeleteTemplate: (template: Template) => void;
  onMoveDocument?: (docId: string, folderId: string) => void;
  onNavigate?: () => void;
  maps?: MapSummary[];
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="caption"
      sx={{
        color: "text.secondary",
        px: 1,
        pb: 1,
        display: "block",
        textTransform: "uppercase",
        fontWeight: 700,
        fontSize: "0.65rem",
        letterSpacing: "0.08em",
      }}
    >
      {children}
    </Typography>
  );
}

export default function SidebarContent({
  searchQuery,
  searchResults,
  templates = [],
  rootFolders,
  allFolders,
  rootDocuments,
  allDocuments,
  activeTemplateId,
  templateMenuAnchor,
  onTemplateMenuOpen,
  onTemplateMenuClose,
  onEditFolder,
  onDeleteFolder,
  onEditDoc,
  onDeleteDoc,
  onEditTemplate,
  onDeleteTemplate,
  onMoveDocument,
  onNavigate,
  maps = [],
}: SidebarContentProps) {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  const activeTemplate = templates.find(
    (template) => template.id === activeTemplateId,
  );
  const [templatesExpanded, setTemplatesExpanded] = useState(true);

  return (
    <Box sx={{ 
      flex: 1, 
      overflow: "auto", 
      px: 1, 
      py: 1.5,
      /* Hide scrollbar for Chrome, Safari and Opera */
      "&::-webkit-scrollbar": {
        display: "none"
      },
      /* Hide scrollbar for IE, Edge and Firefox */
      msOverflowStyle: "none",
      scrollbarWidth: "none"
    }}>
      {searchQuery.length >= 2 && searchResults ? (
        <Stack spacing={0.5}>
          <SectionLabel>Resultados da busca</SectionLabel>
          {searchResults.length === 0 ? (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                textAlign: "center",
                py: 4,
                fontSize: "0.85rem",
              }}
            >
              Nenhum resultado encontrado
            </Typography>
          ) : (
            searchResults.map((doc) => {
              const templateIcon = doc.template_id
                ? templates.find((t) => t.id === doc.template_id)?.icon
                : undefined;
              return (
                <DocumentItem
                  key={doc.id}
                  document={doc}
                  templateIcon={templateIcon}
                  onNavigate={onNavigate}
                />
              );
            })
          )}
        </Stack>
      ) : (
        <Stack spacing={0}>
          {templates.length > 0 && (
            <Box sx={{ mb: 2 }}>
              {/* Collapsible Templates Header */}
              <Box
                onClick={() => setTemplatesExpanded((prev) => !prev)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 1,
                  pb: 1,
                  cursor: "pointer",
                  userSelect: "none",
                  "&:hover .templ-chevron": { color: "text.primary" },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    fontSize: "0.65rem",
                    letterSpacing: "0.08em",
                    flex: 1,
                  }}
                >
                  Templates
                </Typography>
                <KeyboardArrowDownIcon
                  className="templ-chevron"
                  sx={{
                    fontSize: "0.9rem",
                    color: "text.disabled",
                    transition: "transform 0.2s ease",
                    transform: templatesExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                  }}
                />
              </Box>

              <Collapse in={templatesExpanded} timeout={200}>
                {templates.map((template) => (
                  <Box
                    key={template.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      px: 1.5,
                      py: 1,
                      borderRadius: "10px",
                      color: "text.secondary",
                      transition: "all 0.15s ease",
                      "&:hover": {
                        bgcolor: "rgba(142, 36, 170, 0.06)",
                        color: "text.primary",
                        "& .templ-actions": { opacity: 1 },
                      },
                    }}
                  >
                    <Box sx={{ fontSize: "0.95rem", lineHeight: 1 }}>
                      {template.icon}
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        minWidth: 0,
                        flex: 1,
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {template.name}
                    </Typography>

                    <IconButton
                      className="templ-actions"
                      size="small"
                      onClick={(event) => onTemplateMenuOpen(event, template.id)}
                      sx={{
                        p: 0.25,
                        opacity: {
                          xs: 1,
                          md: activeTemplateId === template.id ? 1 : 0,
                        },
                        transition: "opacity 0.2s",
                        "&:hover": {
                          opacity: 1,
                          bgcolor: "rgba(142, 36, 170, 0.1)",
                        },
                      }}
                    >
                      <MoreVertIcon sx={{ fontSize: "1rem" }} />
                    </IconButton>
                  </Box>
                ))}

                <Menu
                  anchorEl={templateMenuAnchor}
                  open={Boolean(templateMenuAnchor)}
                  onClose={onTemplateMenuClose}
                  sx={{
                    "& .MuiPaper-root": {
                      bgcolor: "background.paper",
                      border: "1px solid rgba(142, 36, 170, 0.12)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.5)",
                      borderRadius: "8px",
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      if (activeTemplate) onEditTemplate(activeTemplate);
                      onTemplateMenuClose();
                    }}
                    sx={{ fontSize: "0.85rem" }}
                  >
                    Editar
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      if (activeTemplate) onDeleteTemplate(activeTemplate);
                      onTemplateMenuClose();
                    }}
                    sx={{ fontSize: "0.85rem", color: "error.main" }}
                  >
                    Apagar
                  </MenuItem>
                </Menu>
              </Collapse>

              <Divider sx={{ mt: 1.5 }} />
            </Box>
          )}

          <SectionLabel>Arquivos</SectionLabel>

          {rootFolders.map((folder) => (
            <FolderTreeItem
              key={folder.id}
              folder={folder}
              allFolders={allFolders}
              documents={allDocuments}
              templates={templates}
              onEditFolder={onEditFolder}
              onDeleteFolder={onDeleteFolder}
              onEditDoc={onEditDoc}
              onDeleteDoc={onDeleteDoc}
              onMoveDocument={onMoveDocument}
              onNavigate={onNavigate}
            />
          ))}

          {rootDocuments.map((doc) => {
            const templateIcon = doc.template_id
              ? templates.find((t) => t.id === doc.template_id)?.icon
              : undefined;
            return (
              <DocumentItem
                key={doc.id}
                document={doc}
                templateIcon={templateIcon}
                onEdit={() => onEditDoc(doc)}
                onDelete={() => onDeleteDoc(doc)}
                onNavigate={onNavigate}
              />
            );
          })}

          {rootFolders.length === 0 && rootDocuments.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <DescriptionOutlinedIcon
                sx={{
                  fontSize: 32,
                  color: "rgba(212, 175, 55, 0.15)",
                  mb: 1,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontSize: "0.8rem",
                }}
              >
                Nenhum documento ainda
              </Typography>
            </Box>
          )}

          {/* Maps section */}
          {maps.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 1.5 }} />
              <SectionLabel>Mapas</SectionLabel>
              {maps.map((map) => (
                <Box
                  key={map.id}
                  onClick={() => {
                    router.push(`/campaigns/${campaignId}/maps/${map.id}`);
                    onNavigate?.();
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    px: 1.5,
                    py: 1,
                    borderRadius: "10px",
                    color: "text.secondary",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor: "rgba(212, 175, 55, 0.06)",
                      color: "text.primary",
                    },
                  }}
                >
                  <MapIcon sx={{ fontSize: "1rem", opacity: 0.6 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      minWidth: 0,
                      flex: 1,
                      fontSize: "0.85rem",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {map.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Stack>
      )}
    </Box>
  );
}
