"use client";

import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import Mention from "@tiptap/extension-mention";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { Markdown } from "tiptap-markdown";
import { Details, DetailsSummary, DetailsContent } from "@/lib/tiptap/extensions/details";
import { useCallback, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import useUpdateDocument from "@/lib/hooks/useUpdateDocument";
import useDocuments from "@/lib/hooks/useDocuments";
import useCurrentUser from "@/lib/hooks/useCurrentUser";
import * as Y from "yjs";
import { DocumentLink, DocumentSummary } from "@/lib/types/Documents";
import useCollaboration from "@/lib/hooks/useCollaboration";
import useMentionHover from "@/lib/hooks/useMentionHover";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import EditorToolbar from "./Toolbar";
import CollaborationAvatars from "./CollaborationAvatars";
import MentionHoverPopover from "./MentionHoverPopover";
import useMentionSuggestion from "@/lib/hooks/useMentionSuggestion";
import { SyncLinks, GetLinks } from "@/lib/api/documents";
import { toast } from "sonner";

interface EditorProps {
  title?: string;
  folderId?: string;
  initialContent?: Record<string, unknown>;
}

export default function Editor({
  title,
  folderId,
  initialContent,
}: EditorProps) {
  const params = useParams();
  const campaignId = params.id as string;
  const docId = params.docId as string;
  const updateDocument = useUpdateDocument();
  const router = useRouter();

  const currentUser = useCurrentUser();
  const username = currentUser.data?.username ?? "Anônimo";

  const queryClient = useQueryClient();

  const documentLinks = useQuery({
    queryKey: ["documentLinks", campaignId, docId],
    queryFn: () => GetLinks(campaignId, docId),
    staleTime: 1000 * 60 * 5, // 5 min — atualizado após cada save com menções
  });

  const documentsQuery = useDocuments(campaignId);
  const availableDocs = documentsQuery.data || [];

  const mentionSuggestion = useMentionSuggestion(campaignId, docId);

  const { ydoc, provider, providerRef, connectedUsers, syncedRef, attemptInitialLoad } =
    useCollaboration({
      docId,
      username,
      initialContent,
    });

  const {
    hoveredMention,
    mentionData,
    isMentionLoading,
    handleMentionMouseEnter,
    handleMentionMouseLeave,
    handleClose: handleMentionClose,
  } = useMentionHover(campaignId);

  const isReadyRef = useRef(false);
  const prevMentionKeyRef = useRef<string>("");

  const debouncedSave = useDebouncedCallback((jsonContent: JSONContent) => {
    if (!isReadyRef.current) return;

    const templateData = initialContent?.templateData;

    // Encode YJS state to base64 usando Uint8Array spread (mais eficiente que loop)
    const yjsState = Y.encodeStateAsUpdate(ydoc);
    const yjsStateBase64 = btoa(String.fromCharCode(...yjsState));

    updateDocument.mutate({
      campaignId: campaignId,
      documentId: docId,
      title: title,
      folderID: folderId,
      content: { ...jsonContent, templateData },
      yjsState: yjsStateBase64,
    });

    const extractedMentions: { target_doc_id: string; mention_text: string }[] =
      [];
    const traverse = (node: JSONContent) => {
      if (node.type === "mention") {
        extractedMentions.push({
          target_doc_id: String(node.attrs?.id ?? ""),
          mention_text: String(node.attrs?.label ?? "Link"),
        });
      }
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
    };
    if (jsonContent) traverse(jsonContent);

    const uniqueMentions = Array.from(
      new Map(
        extractedMentions.map((item) => [item.target_doc_id, item]),
      ).values(),
    );

    // Só sincroniza menções se houver mudança (evita request a cada save sem alteração)
    const mentionKey = uniqueMentions.map((m) => m.target_doc_id).sort().join(",");
    if (mentionKey !== prevMentionKeyRef.current) {
      prevMentionKeyRef.current = mentionKey;
      SyncLinks(campaignId, docId, uniqueMentions)
        .then(() => {
          // Atualiza o painel de backlinks após sincronizar
          queryClient.invalidateQueries({ queryKey: ["documentLinks", campaignId, docId] });
        })
        .catch(() => toast.error("Falha ao salvar menções"));
    }
  }, 1000);

  useEffect(() => {
    return () => {
      debouncedSave.flush();
    };
  }, [debouncedSave]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ document: ydoc }),
      CollaborationCursor.configure({
        provider: provider as any,
        user: {
          name: username,
          color: "#BA68C8",
        },
      }),
      Underline,
      TextStyle,
      Color,
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion: mentionSuggestion,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "editor-table",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList.configure({
        HTMLAttributes: { class: "task-list" },
      }),
      TaskItem.configure({ nested: true }),
      Markdown,
      Details,
      DetailsSummary,
      DetailsContent,
    ],
    onUpdate: ({ editor }) => {
      if (isReadyRef.current) {
        debouncedSave(editor.getJSON());
      }
    },
  });

  // Update CollaborationCursor provider when it becomes available
  const editorExtensionsUpdatedRef = useRef(false);
  useEffect(() => {
    if (!editor || !providerRef.current || editorExtensionsUpdatedRef.current) return;
    editorExtensionsUpdatedRef.current = true;
    const cursorExt = editor.extensionManager.extensions.find(
      (e) => e.name === "collaborationCursor",
    );
    if (cursorExt) {
      cursorExt.options.provider = providerRef.current;
      cursorExt.options.user = {
        name: username,
        color: "#BA68C8",
      };
    }
  }, [editor, providerRef, username]);

  const runAttemptLoad = useCallback(() => {
    if (editor) {
      attemptInitialLoad(editor);
      // Mark as ready after a brief delay to allow TipTap/Yjs to stabilize
      setTimeout(() => {
        isReadyRef.current = true;
      }, 500);
    }
  }, [editor, attemptInitialLoad]);

  useEffect(() => {
    const provider = providerRef.current;
    if (!provider) return;

    const handleSync = (isSynced: boolean) => {
      syncedRef.current = isSynced;
      
      // If synced and has content, we are ready
      const fragment = ydoc.getXmlFragment("prosemirror");
      if (isSynced && fragment.length > 0) {
        isReadyRef.current = true;
      }
      
      runAttemptLoad();
    };

    provider.on("sync", handleSync);
    return () => {
      provider.off("sync", handleSync);
    };
  }, [providerRef, syncedRef, runAttemptLoad, ydoc]);

  // If initial load finishes, we are definitely ready
  useEffect(() => {
    if (ydoc.getXmlFragment("prosemirror").length > 0) {
        isReadyRef.current = true;
    }
  }, [ydoc]);

  useEffect(() => {
    const timeout = setTimeout(() => runAttemptLoad(), 600);
    return () => clearTimeout(timeout);
  }, [runAttemptLoad]);

  // Mention click + hover handlers
  useEffect(() => {
    if (!editor) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches(".mention")) {
        const targetId = target.getAttribute("data-id");
        if (targetId) {
          window.open(`/campaigns/${campaignId}/docs/${targetId}`, "_blank");
        }
      }
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches(".mention")) {
        const targetId = target.getAttribute("data-id");
        if (targetId) {
          handleMentionMouseEnter(targetId, target);
        }
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches(".mention")) {
        const relatedTarget = e.relatedTarget as HTMLElement;
        // don't close if moving into the popover
        if (!relatedTarget?.closest('[data-mention-popover]')) {
          handleMentionMouseLeave();
        }
      }
    };

    const dom = editor.view.dom;
    dom.addEventListener("click", handleClick);
    dom.addEventListener("mouseover", handleMouseEnter);
    dom.addEventListener("mouseout", handleMouseLeave);

    return () => {
      if (editor?.view?.dom) {
        dom.removeEventListener("click", handleClick);
        dom.removeEventListener("mouseover", handleMouseEnter);
        dom.removeEventListener("mouseout", handleMouseLeave);
      }
    };
  }, [editor, campaignId, handleMentionMouseEnter, handleMentionMouseLeave]);

  if (!editor) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          maxWidth: "960px",
          mx: "auto",
          my: { xs: 2, md: 4 },
          bgcolor: "rgba(22, 27, 34, 0.5)",
          borderRadius: { xs: "16px", md: "20px" },
          border: "1px solid rgba(212, 175, 55, 0.06)",
          minHeight: { xs: "60vh", md: "70vh" },
          overflow: "visible",
          transition: "border-color 0.3s ease",
          "&:focus-within": {
            borderColor: "rgba(212, 175, 55, 0.15)",
          },
        }}
      >
        <EditorToolbar
          editor={editor}
          connectedUsers={connectedUsers}
          providerRef={providerRef}
        />
        <EditorContent editor={editor} />

        {documentLinks.data &&
          (documentLinks.data.links_from?.length > 0 ||
            documentLinks.data.links_to?.length > 0) && (
            <Box
              sx={{
                mt: 3,
                pt: 2.5,
                px: { xs: 2, sm: 3, md: 4 },
                pb: { xs: 2.5, md: 4 },
                borderTop: "1px solid rgba(212, 175, 55, 0.1)",
              }}
            >
              {documentLinks.data.links_to?.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      display: "block",
                      mb: 1,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Mencionado em
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {documentLinks.data.links_to.map((link: DocumentLink) => {
                      const sourceDoc = availableDocs.find(
                        (d: DocumentSummary) => d.id === link.source_doc_id,
                      );
                      return (
                        <Chip
                          key={link.id}
                          label={sourceDoc?.title || "Documento"}
                          size="small"
                          onClick={() =>
                            router.push(
                              `/campaigns/${campaignId}/docs/${link.source_doc_id}`,
                            )
                          }
                          sx={{
                            bgcolor: "rgba(186, 104, 200, 0.1)",
                            color: "#ce93d8",
                            border: "1px solid rgba(186, 104, 200, 0.3)",
                            "&:hover": { bgcolor: "rgba(186, 104, 200, 0.25)" },
                          }}
                        />
                      );
                    })}
                  </Stack>
                </Box>
              )}

              {documentLinks.data.links_from?.length > 0 && (
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontWeight: 600,
                      display: "block",
                      mb: 1,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Menciona
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {documentLinks.data.links_from.map((link: DocumentLink) => {
                      const targetDoc = availableDocs.find(
                        (d: DocumentSummary) => d.id === link.target_doc_id,
                      );
                      return (
                        <Chip
                          key={link.id}
                          label={
                            targetDoc?.title || link.mention_text || "Documento"
                          }
                          size="small"
                          onClick={() =>
                            router.push(
                              `/campaigns/${campaignId}/docs/${link.target_doc_id}`,
                            )
                          }
                          sx={{
                            bgcolor: "rgba(255, 255, 255, 0.05)",
                            color: "text.secondary",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
                          }}
                        />
                      );
                    })}
                  </Stack>
                </Box>
              )}
            </Box>
          )}
      </Box>

      {/* Mention Hover Popover - rendered outside editor box to avoid overflow clipping */}
      <MentionHoverPopover
        anchorEl={hoveredMention?.anchorEl ?? null}
        mentionData={mentionData}
        isLoading={isMentionLoading}
        onClose={handleMentionClose}
      />
    </>
  );
}
