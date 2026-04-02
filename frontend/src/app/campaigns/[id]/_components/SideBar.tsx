"use client";

import Box from "@mui/material/Box";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { MouseEvent, useCallback, useState } from "react";
import ConfirmDeleteModal from "../../_components/ConfirmDeleteModal";
import useDeleteDocument from "@/lib/hooks/useDeleteDocument";
import useDeleteFolder from "@/lib/hooks/useDeleteFolder";
import useDeleteTemplate from "@/lib/hooks/useDeleteTemplate";
import useUpdateDocument from "@/lib/hooks/useUpdateDocument";
import useDocuments from "@/lib/hooks/useDocuments";
import useFolders from "@/lib/hooks/useFolders";
import useGetCampaign from "@/lib/hooks/useGetCampaign";
import useSearchQuery from "@/lib/hooks/useSearchQuery";
import useTemplates from "@/lib/hooks/useTemplates";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import useMaps from "@/lib/hooks/useMaps";
import { DocumentSummary } from "@/lib/types/Documents";
import { Folder } from "@/lib/types/Folder";
import { Template } from "@/lib/types/Template";
import AddMemberModal from "./AddMemberModal";
import CreateDocModal from "./CreateDocModal";
import CreateFolderModal from "./CreateFolderModal";
import CreateTemplateModal from "./CreateTemplateModal";
import SidebarContent from "./SidebarContent";
import SidebarHeader from "./SidebarHeader";
import SidebarQuickActions from "./SidebarQuickActions";
import CreateMapModal from "../maps/_components/CreateMapModal";

interface SideBarProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

export default function SideBar({
  isMobile = false,
  onNavigate,
}: SideBarProps) {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const campaign = useGetCampaign(campaignId);
  const templates = useTemplates(campaignId);
  const documents = useDocuments(campaignId);
  const folders = useFolders(campaignId);
  const { data: currentUser } = useCurrentUser();
  const maps = useMaps(campaignId);

  const deleteFolder = useDeleteFolder();
  const deleteTemplate = useDeleteTemplate();
  const deleteDocument = useDeleteDocument();
  const updateDocument = useUpdateDocument();
  const queryClient = useQueryClient();

  // Drag-and-drop: move documento para pasta — centralizado aqui para evitar
  // instanciar N mutation hooks dentro de cada FolderTreeItem
  const handleMoveDocument = useCallback(
    (docId: string, folderId: string) => {
      updateDocument.mutate(
        { campaignId, documentId: docId, folderID: folderId },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["documents", campaignId] });
          },
        },
      );
    },
    [campaignId, updateDocument, queryClient],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const [folderToEdit, setFolderToEdit] = useState<Folder | undefined>();
  const [templateToEdit, setTemplateToEdit] = useState<Template | undefined>();
  const [docToEdit, setDocToEdit] = useState<DocumentSummary | undefined>();

  const [folderToDelete, setFolderToDelete] = useState<Folder | undefined>();
  const [templateToDelete, setTemplateToDelete] = useState<
    Template | undefined
  >();
  const [docToDelete, setDocToDelete] = useState<DocumentSummary | undefined>();

  const [templateMenuAnchor, setTemplateMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  const searchResults = useSearchQuery(campaignId, searchQuery);
  const rootFolders = folders.data?.filter((folder) => !folder.parent_id) ?? [];
  const rootDocuments =
    documents.data?.filter((document) => !document.folder_id) ?? [];

  const handleTemplateMenuOpen = (
    event: MouseEvent<HTMLElement>,
    templateId: string,
  ) => {
    event.stopPropagation();
    setTemplateMenuAnchor(event.currentTarget);
    setActiveTemplateId(templateId);
  };

  const handleTemplateMenuClose = () => {
    setTemplateMenuAnchor(null);
    setActiveTemplateId(null);
  };

  const handleEditFolder = (folder: Folder) => {
    setFolderToEdit(folder);
    setIsFolderModalOpen(true);
  };

  const handleEditDoc = (document: DocumentSummary) => {
    setDocToEdit(document);
    setIsDocModalOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: "100%",
        }}
      >
        <SidebarHeader
          campaignName={campaign.data?.name}
          isMobile={isMobile}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onBack={() => {
            router.push("/campaigns");
            onNavigate?.();
          }}
          onOpenCampaign={() => {
            router.push(`/campaigns/${campaignId}`);
            onNavigate?.();
          }}
          onOpenMembers={() => setIsMemberModalOpen(true)}
        />

        <SidebarQuickActions
          onCreateDoc={() => setIsDocModalOpen(true)}
          onCreateFolder={() => setIsFolderModalOpen(true)}
          onCreateTemplate={() => setIsTemplateModalOpen(true)}
          onCreateMap={() => setIsMapModalOpen(true)}
        />

        <SidebarContent
          searchQuery={searchQuery}
          searchResults={searchResults.data}
          templates={templates.data}
          rootFolders={rootFolders}
          allFolders={folders.data ?? []}
          rootDocuments={rootDocuments}
          allDocuments={documents.data ?? []}
          activeTemplateId={activeTemplateId}
          templateMenuAnchor={templateMenuAnchor}
          onTemplateMenuOpen={handleTemplateMenuOpen}
          onTemplateMenuClose={handleTemplateMenuClose}
          onEditFolder={handleEditFolder}
          onDeleteFolder={setFolderToDelete}
          onEditDoc={handleEditDoc}
          onDeleteDoc={setDocToDelete}
          onEditTemplate={(template) => {
            setTemplateToEdit(template);
            setIsTemplateModalOpen(true);
          }}
          onDeleteTemplate={setTemplateToDelete}
          onMoveDocument={handleMoveDocument}
          onNavigate={onNavigate}
          maps={maps.data}
        />
        {currentUser && !currentUser.is_premium && (
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "rgba(212, 175, 55, 0.06)",
              textAlign: "center",
              mt: "auto",
            }}
          >
            <Box
              component="span"
              sx={{
                fontSize: "0.75rem",
                color: "text.secondary",
                display: "block",
                mb: 0.5,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Documentos Criados
            </Box>
            <Box
              component="span"
              sx={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color:
                  (currentUser.document_count || 0) >= 15
                    ? "error.main"
                    : "primary.main",
              }}
            >
              {String(currentUser.document_count || 0).padStart(2, "0")}/15
            </Box>
          </Box>
        )}
      </Box>

      <CreateDocModal
        isModalOpen={isDocModalOpen}
        setIsModalOpen={(open) => {
          setIsDocModalOpen(open);
          if (!open) {
            setDocToEdit(undefined);
          }
        }}
        initialData={docToEdit}
      />

      <CreateFolderModal
        isModalOpen={isFolderModalOpen}
        setIsModalOpen={(open) => {
          setIsFolderModalOpen(open);
          if (!open) {
            setFolderToEdit(undefined);
          }
        }}
        initialData={folderToEdit}
      />

      <CreateTemplateModal
        isModalOpen={isTemplateModalOpen}
        setIsModalOpen={(open) => {
          setIsTemplateModalOpen(open);
          if (!open) {
            setTemplateToEdit(undefined);
          }
        }}
        initialData={templateToEdit}
      />

      <AddMemberModal
        isModalOpen={isMemberModalOpen}
        setIsModalOpen={setIsMemberModalOpen}
      />

      <CreateMapModal
        isModalOpen={isMapModalOpen}
        setIsModalOpen={setIsMapModalOpen}
      />

      <ConfirmDeleteModal
        isModalOpen={!!folderToDelete}
        setIsModalOpen={() => setFolderToDelete(undefined)}
        title="Apagar Pasta"
        description={`Tem certeza que deseja apagar a pasta "${folderToDelete?.name}"? Os documentos poderÃ£o ser perdidos.`}
        isLoading={deleteFolder.isPending}
        onConfirm={() => {
          if (folderToDelete) {
            deleteFolder.mutate(
              { campaignId, folderId: folderToDelete.id },
              {
                onSuccess: () => {
                  setFolderToDelete(undefined);
                  queryClient.invalidateQueries({
                    queryKey: ["folders", campaignId],
                  });
                },
              },
            );
          }
        }}
      />

      <ConfirmDeleteModal
        isModalOpen={!!templateToDelete}
        setIsModalOpen={() => setTemplateToDelete(undefined)}
        title="Apagar Template"
        description={`Tem certeza que deseja apagar o template "${templateToDelete?.name}"? Documentos que usam este template continuarÃ£o existindo, mas os campos especiais nÃ£o.`}
        isLoading={deleteTemplate.isPending}
        onConfirm={() => {
          if (templateToDelete) {
            deleteTemplate.mutate(
              { campaignId, templateId: templateToDelete.id },
              {
                onSuccess: () => {
                  setTemplateToDelete(undefined);
                  queryClient.invalidateQueries({
                    queryKey: ["templates", campaignId],
                  });
                },
              },
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
              {
                onSuccess: () => {
                  setDocToDelete(undefined);
                  queryClient.invalidateQueries({
                    queryKey: ["documents", campaignId],
                  });
                  queryClient.invalidateQueries({
                    queryKey: ["currentUser"],
                  });
                },
              },
            );
          }
        }}
      />
    </>
  );
}
