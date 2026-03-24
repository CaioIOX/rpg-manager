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
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import useUpdateDocument from "@/lib/hooks/useUpdateDocument";
import Box from "@mui/material/Box";
import EditorToolbar from "./Toolbar";

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

  const ydoc = useMemo(() => new Y.Doc(), []);

  const [isSynced, setIsSynced] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!docId) return;

    const wsBaseUrl = "ws://localhost:8080";
    console.log("Attempting to connect WebSocket to:", wsBaseUrl, `ws/doc/${docId}`);

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
    ],
    onUpdate: ({ editor }) => {
      debouncedSave(editor.getJSON());
    },
  });

  console.log("hasInitialized:", hasInitialized, "editor.isEmpty:", editor?.isEmpty);

  useEffect(() => {
    if (editor && initialContent && !hasInitialized) {
      console.log("Loading initial content from JSON DB because Custom Yjs server doesn't persist full state.");
      
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
    </Box>
  );
}
