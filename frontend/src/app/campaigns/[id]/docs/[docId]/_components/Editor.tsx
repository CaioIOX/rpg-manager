"use client";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useEditor, EditorContent } from "@tiptap/react";
import Collaboration from "@tiptap/extension-collaboration";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import Mention from "@tiptap/extension-mention";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import useUpdateDocument from "@/lib/hooks/useUpdateDocument";
import useDocuments from "@/lib/hooks/useDocuments";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import EditorToolbar from "./Toolbar";
import useMentionSuggestion from "@/lib/hooks/useMentionSuggestion";
import { SyncLinks, GetLinks } from "@/lib/api/documents";

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

  const documentLinks = useQuery({
    queryKey: ["documentLinks", campaignId, docId],
    queryFn: () => GetLinks(campaignId, docId),
    refetchInterval: 10000,
  });

  const documentsQuery = useDocuments(campaignId);
  const availableDocs = documentsQuery.data || [];

  const mentionSuggestion = useMentionSuggestion(campaignId, docId);

  const ydoc = useMemo(() => new Y.Doc(), []);

  const [isSynced, setIsSynced] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!docId) return;

    const wsBaseUrl = "ws://localhost:8080";

    const provider = new WebsocketProvider(wsBaseUrl, `ws/doc/${docId}`, ydoc);

    provider.on("sync", (isSynced: boolean) => {
      if (isSynced) setIsSynced(true);
    });

    return () => {
      provider.destroy();
    };
  }, [docId, ydoc]);

  const debouncedSave = useDebouncedCallback((jsonContent) => {
    const templateData = initialContent?.templateData;

    updateDocument.mutate({
      campaignId: campaignId,
      documentId: docId,
      title: title,
      folderID: folderId,
      content: { ...jsonContent, templateData },
    });

    const extractedMentions: { target_doc_id: string; mention_text: string }[] = [];
    const traverse = (node: any) => {
      if (node.type === "mention") {
        extractedMentions.push({
          target_doc_id: node.attrs.id,
          mention_text: node.attrs.label || "Link",
        });
      }
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach(traverse);
      }
    };
    if (jsonContent) traverse(jsonContent);

    const uniqueMentions = Array.from(new Map(extractedMentions.map(item => [item.target_doc_id, item])).values());
    SyncLinks(campaignId, docId, uniqueMentions).catch((err) =>
      console.error("Falha ao salvar menções:", err)
    );
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
      Underline,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: "Comece a escrever sua aventura...",
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion: mentionSuggestion as any,
      }),
    ],
    onUpdate: ({ editor }) => {
      debouncedSave(editor.getJSON());
    },
  });

  useEffect(() => {
    if (editor && initialContent && !hasInitialized) {
      console.log(
        "Loading initial content from JSON DB because Custom Yjs server doesn't persist full state.",
      );

      const loadContent = () => {
        const contentToLoad = {
          type: initialContent.type || "doc",
          content: initialContent.content || [],
        };

        console.log("Loading content:", contentToLoad);
        if (editor.isEmpty) {
          editor.commands.setContent(contentToLoad as any);
        }
      };

      setTimeout(loadContent, 100);
      setHasInitialized(true);
    }
  }, [editor, initialContent, hasInitialized]);

  useEffect(() => {
    if (!editor) return;

    const handleMentionClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches(".mention")) {
        const targetId = target.getAttribute("data-id");
        if (targetId) {
          window.open(`/campaigns/${campaignId}/docs/${targetId}`, "_blank");
        }
      }
    };

    editor.view.dom.addEventListener("click", handleMentionClick);
    return () => {
      if (editor?.view?.dom) {
        editor.view.dom.removeEventListener("click", handleMentionClick);
      }
    };
  }, [editor, campaignId]);

  if (!editor) {
    return null;
  }

  return (
    <Box
      sx={{
        maxWidth: "800px",
        mx: "auto",
        my: 4,
        bgcolor: "rgba(22, 27, 34, 0.5)",
        borderRadius: "20px",
        border: "1px solid rgba(212, 175, 55, 0.06)",
        minHeight: "70vh",
        overflow: "hidden",
        transition: "border-color 0.3s ease",
        "&:focus-within": {
          borderColor: "rgba(212, 175, 55, 0.15)",
        },
      }}
    >
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
      
      {documentLinks.data && (documentLinks.data.links_from?.length > 0 || documentLinks.data.links_to?.length > 0) && (
        <Box sx={{ mt: 4, pt: 3, px: 4, pb: 4, borderTop: "1px solid rgba(212, 175, 55, 0.1)" }}>
          {documentLinks.data.links_to?.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 1, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Mencionado em
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {documentLinks.data.links_to.map(link => {
                  const sourceDoc = availableDocs.find(d => d.id === link.source_doc_id);
                  return (
                    <Chip 
                      key={link.id} 
                      label={sourceDoc?.title || "Documento"} 
                      size="small"
                      onClick={() => router.push(`/campaigns/${campaignId}/docs/${link.source_doc_id}`)}
                      sx={{ 
                        bgcolor: "rgba(186, 104, 200, 0.1)", 
                        color: "#ce93d8",
                        border: "1px solid rgba(186, 104, 200, 0.3)",
                        "&:hover": { bgcolor: "rgba(186, 104, 200, 0.25)" }
                      }} 
                    />
                  );
                })}
              </Stack>
            </Box>
          )}

          {documentLinks.data.links_from?.length > 0 && (
            <Box>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 1, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Menciona
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {documentLinks.data.links_from.map(link => {
                  const targetDoc = availableDocs.find(d => d.id === link.target_doc_id);
                  return (
                    <Chip 
                      key={link.id} 
                      label={targetDoc?.title || link.mention_text || "Documento"} 
                      size="small"
                      onClick={() => router.push(`/campaigns/${campaignId}/docs/${link.target_doc_id}`)}
                      sx={{ 
                        bgcolor: "rgba(255, 255, 255, 0.05)", 
                        color: "text.secondary",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" }
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
  );
}
