"use client";

import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Menu,
  MenuItem as MuiMenuItem,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useParams, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useGetCampaign from "@/lib/hooks/useGetCampaign";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useSearchQuery from "@/lib/hooks/useSearchQuery";
import useTemplates from "@/lib/hooks/useTemplates";
import useFolders from "@/lib/hooks/useFolders";
import useDocuments from "@/lib/hooks/useDocuments";
import useDeleteFolder from "@/lib/hooks/useDeleteFolder";
import useDeleteTemplate from "@/lib/hooks/useDeleteTemplate";
import useDeleteDocument from "@/lib/hooks/useDeleteDocument";
import { useState, MouseEvent } from "react";
import CreateDocModal from "./CreateDocModal";
import CreateFolderModal from "./CreateFolderModal";
import CreateTemplateModal from "./CreateTemplateModal";
import AddMemberModal from "./AddMemberModal";
import FolderTreeItem from "./FolderTreeItem";
import DocumentItem from "./DocumentItem";
import ConfirmDeleteModal from "../../_components/ConfirmDeleteModal";
import { Folder } from "@/lib/types/Folder";
import { Template } from "@/lib/types/Template";
import { DocumentSummary } from "@/lib/types/Documents";
import { useQueryClient } from "@tanstack/react-query";

export default function SideBar() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const campaign = useGetCampaign(campaignId);
  const templates = useTemplates(campaignId);
  const documents = useDocuments(campaignId);
  const folders = useFolders(campaignId);

  const deleteFolder = useDeleteFolder();
  const deleteTemplate = useDeleteTemplate();
  const deleteDocument = useDeleteDocument();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  // Edit states
  const [folderToEdit, setFolderToEdit] = useState<Folder | undefined>();
  const [templateToEdit, setTemplateToEdit] = useState<Template | undefined>();
  const [docToEdit, setDocToEdit] = useState<DocumentSummary | undefined>();

  // Delete states
  const [folderToDelete, setFolderToDelete] = useState<Folder | undefined>();
  const [templateToDelete, setTemplateToDelete] = useState<Template | undefined>();
  const [docToDelete, setDocToDelete] = useState<DocumentSummary | undefined>();

  // Template Menu
  const [templateMenuAnchor, setTemplateMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  const handleTemplateMenuOpen = (event: MouseEvent<HTMLElement>, templateId: string) => {
    event.stopPropagation();
    setTemplateMenuAnchor(event.currentTarget);
    setActiveTemplateId(templateId);
  };
  const handleTemplateMenuClose = () => {
    setTemplateMenuAnchor(null);
    setActiveTemplateId(null);
  };

  const handleEditFolder = (f: Folder) => {
    setFolderToEdit(f);
    setIsFolderModalOpen(true);
  };
  const handleEditDoc = (d: DocumentSummary) => {
    setDocToEdit(d);
    setIsDocModalOpen(true);
  };

  const searchResults = useSearchQuery(campaignId, searchQuery);

  // Folders without a parent (root-level)
  const rootFolders = folders.data?.filter((f) => !f.parent_id) ?? [];
  // Documents without a folder (root-level)
  const rootDocuments =
    documents.data?.filter((d) => !d.folderID) ?? [];

  return (
    <>
      <Box
        sx={{
          width: "300px",
          minWidth: "300px",
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "rgba(212, 175, 55, 0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid",
            borderColor: "rgba(212, 175, 55, 0.08)",
            background:
              "linear-gradient(180deg, rgba(212, 175, 55, 0.04) 0%, transparent 100%)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box
              onClick={() => router.push(`/campaigns`)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                px: 0.5,
                py: 0.5,
                borderRadius: "10px",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.04)",
                  "& .back-arrow": {
                    transform: "translateX(-2px)",
                  },
                },
              }}
            >
              <IconButton
                aria-label="Voltar"
                size="small"
                className="back-arrow"
                sx={{
                  color: "text.secondary",
                  transition: "all 0.2s ease",
                  "&:hover": { bgcolor: "transparent" },
                }}
              >
                <ArrowBackIcon fontSize="small" />
              </IconButton>
              <Typography
                variant="subtitle2"
                sx={{
                  fontFamily: '"Merriweather", "Georgia", serif',
                  color: "primary.main",
                  fontWeight: 700,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "160px",
                }}
              >
                {campaign.data?.name}
              </Typography>
            </Box>
            <Tooltip title="Adicionar Membro" arrow>
              <IconButton
                aria-label="Membros"
                size="small"
                onClick={() => setIsMemberModalOpen(true)}
                sx={{
                  color: "text.secondary",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "primary.main",
                    bgcolor: "rgba(212, 175, 55, 0.08)",
                  },
                }}
              >
                <PersonIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <TextField
            placeholder="Buscar documentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            size="small"
            variant="outlined"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{ fontSize: "1.1rem", color: "text.secondary" }}
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "rgba(13, 17, 23, 0.5)",
                fontSize: "0.85rem",
                borderRadius: "12px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255, 255, 255, 0.06)",
                },
              },
            }}
          />
        </Box>

        {/* Action buttons */}
        <Stack
          direction={"row"}
          spacing={0.5}
          sx={{
            p: 1.5,
            borderBottom: "1px solid",
            borderColor: "rgba(212, 175, 55, 0.06)",
          }}
        >
          {[
            {
              icon: <AddIcon sx={{ fontSize: "1rem" }} />,
              label: "Doc",
              onClick: () => setIsDocModalOpen(true),
            },
            {
              icon: <FolderIcon sx={{ fontSize: "1rem" }} />,
              label: "Pasta",
              onClick: () => setIsFolderModalOpen(true),
            },
            {
              icon: <SettingsIcon sx={{ fontSize: "1rem" }} />,
              label: "Template",
              onClick: () => setIsTemplateModalOpen(true),
            },
          ].map((action) => (
            <Button
              key={action.label}
              size="small"
              variant="text"
              color="inherit"
              startIcon={action.icon}
              onClick={action.onClick}
              sx={{
                flex: 1,
                fontSize: "0.72rem",
                color: "text.secondary",
                borderRadius: "10px",
                py: 0.8,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(212, 175, 55, 0.06)",
                  color: "primary.main",
                },
              }}
            >
              {action.label}
            </Button>
          ))}
        </Stack>

        {/* File list */}
        <Box sx={{ flex: 1, overflow: "auto", p: 1.5 }}>
          {searchQuery.length >= 2 && searchResults.data ? (
            <Stack direction={"column"} spacing={0.5}>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  px: 1,
                  pb: 0.5,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                }}
              >
                Resultados da busca
              </Typography>
              {searchResults.data.length === 0 ? (
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    textAlign: "center",
                    py: 4,
                    display: "block",
                    fontSize: "0.85rem",
                  }}
                >
                  Nenhum resultado encontrado
                </Typography>
              ) : (
                searchResults.data.map((doc) => (
                  <DocumentItem key={doc.id} document={doc} />
                ))
              )}
            </Stack>
          ) : (
            <Stack direction={"column"} spacing={0}>
              {/* Templates section */}
              {(templates.data?.length ?? 0) > 0 && (
                <Box sx={{ mb: 2 }}>
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
                    Templates
                  </Typography>
                  {templates.data?.map((template) => (
                    <Box
                      key={template.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: 1.5,
                        py: 0.8,
                        borderRadius: "10px",
                        fontSize: "0.85rem",
                        color: "text.secondary",
                        cursor: "default",
                        transition: "all 0.15s ease",
                        "&:hover": {
                          bgcolor: "rgba(142, 36, 170, 0.06)",
                          color: "text.primary",
                        },
                      }}
                    >
                      <Box sx={{ fontSize: "0.9rem", lineHeight: 1 }}>
                        {template.icon}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.85rem", fontWeight: 500 }}
                      >
                        {template.name}
                      </Typography>
                      
                      <IconButton
                        size="small"
                        onClick={(e) => handleTemplateMenuOpen(e, template.id)}
                        sx={{ ml: "auto", p: 0.2, opacity: activeTemplateId === template.id ? 1 : 0, transition: "opacity 0.2s", 
                              "&:hover": { opacity: 1, bgcolor: "rgba(142, 36, 170, 0.1)" } }}
                      >
                        <MoreVertIcon sx={{ fontSize: "1rem" }} />
                      </IconButton>
                    </Box>
                  ))}
                  
                  <Menu
                    anchorEl={templateMenuAnchor}
                    open={Boolean(templateMenuAnchor)}
                    onClose={handleTemplateMenuClose}
                    sx={{
                      "& .MuiPaper-root": {
                        bgcolor: "background.paper",
                        border: "1px solid rgba(142, 36, 170, 0.12)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.5)",
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <MuiMenuItem onClick={() => {
                      const t = templates.data?.find(x => x.id === activeTemplateId);
                      if (t) {
                        setTemplateToEdit(t);
                        setIsTemplateModalOpen(true);
                      }
                      handleTemplateMenuClose();
                    }} sx={{ fontSize: "0.85rem" }}>
                      Editar
                    </MuiMenuItem>
                    <MuiMenuItem onClick={() => {
                        const t = templates.data?.find(x => x.id === activeTemplateId);
                        if (t) setTemplateToDelete(t);
                        handleTemplateMenuClose();
                      }}
                      sx={{ fontSize: "0.85rem", color: "error.main" }}
                    >
                      Apagar
                    </MuiMenuItem>
                  </Menu>
                  
                  <Divider sx={{ mt: 1.5 }} />
                </Box>
              )}

              {/* Files section header */}
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
                Arquivos
              </Typography>

              {/* Folder tree */}
              {rootFolders.map((folder) => (
                <FolderTreeItem
                  key={folder.id}
                  folder={folder}
                  allFolders={folders.data ?? []}
                  documents={documents.data ?? []}
                  onEditFolder={handleEditFolder}
                  onDeleteFolder={setFolderToDelete}
                  onEditDoc={handleEditDoc}
                  onDeleteDoc={setDocToDelete}
                />
              ))}

              {/* Root-level documents (no folder) */}
              {rootDocuments.map((doc) => (
                <DocumentItem 
                  key={doc.id} 
                  document={doc} 
                  onEdit={() => handleEditDoc(doc)}
                  onDelete={() => setDocToDelete(doc)}
                />
              ))}

              {/* Empty state */}
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
            </Stack>
          )}
        </Box>
      </Box>

      <CreateDocModal
        isModalOpen={isDocModalOpen}
        setIsModalOpen={(open) => { setIsDocModalOpen(open); if (!open) setDocToEdit(undefined); }}
        initialData={docToEdit}
      />
      <CreateFolderModal
        isModalOpen={isFolderModalOpen}
        setIsModalOpen={(open) => { setIsFolderModalOpen(open); if (!open) setFolderToEdit(undefined); }}
        initialData={folderToEdit}
      />
      <CreateTemplateModal
        isModalOpen={isTemplateModalOpen}
        setIsModalOpen={(open) => { setIsTemplateModalOpen(open); if (!open) setTemplateToEdit(undefined); }}
        initialData={templateToEdit}
      />
      <AddMemberModal
        isModalOpen={isMemberModalOpen}
        setIsModalOpen={setIsMemberModalOpen}
      />

      {/* Delete Modals */}
      <ConfirmDeleteModal
        isModalOpen={!!folderToDelete}
        setIsModalOpen={() => setFolderToDelete(undefined)}
        title="Apagar Pasta"
        description={`Tem certeza que deseja apagar a pasta "${folderToDelete?.name}"? Os documentos poderão ser perdidos.`}
        isLoading={deleteFolder.isPending}
        onConfirm={() => {
          if (folderToDelete) {
            deleteFolder.mutate(
              { campaignId, folderId: folderToDelete.id },
              { onSuccess: () => { setFolderToDelete(undefined); queryClient.invalidateQueries({ queryKey: ["folders", campaignId] }); } }
            );
          }
        }}
      />
      <ConfirmDeleteModal
        isModalOpen={!!templateToDelete}
        setIsModalOpen={() => setTemplateToDelete(undefined)}
        title="Apagar Template"
        description={`Tem certeza que deseja apagar o template "${templateToDelete?.name}"? Documentos que usam este template continuarão existindo, mas os campos especiais não.`}
        isLoading={deleteTemplate.isPending}
        onConfirm={() => {
          if (templateToDelete) {
            deleteTemplate.mutate(
              { campaignId, templateId: templateToDelete.id },
              { onSuccess: () => { setTemplateToDelete(undefined); queryClient.invalidateQueries({ queryKey: ["templates", campaignId] }); } }
            );
          }
        }}
      />
      <ConfirmDeleteModal
        isModalOpen={!!docToDelete}
        setIsModalOpen={() => setDocToDelete(undefined)}
        title="Apagar Documento"
        description={`Tem certeza que deseja apagar o documento "${docToDelete?.title}"?`}
        isLoading={deleteDocument.isPending}
        onConfirm={() => {
          if (docToDelete) {
            deleteDocument.mutate(
              { campaignId, documentId: docToDelete.id },
              { onSuccess: () => { setDocToDelete(undefined); queryClient.invalidateQueries({ queryKey: ["documents", campaignId] }); } }
            );
          }
        }}
      />
    </>
  );
}
