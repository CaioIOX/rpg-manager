"use client";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useEditor, EditorContent } from "@tiptap/react";
import Collaboration from "@tiptap/extension-collaboration";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import useUpdateDocument from "@/lib/hooks/useUpdateDocument";

interface EditorProps {
  title?: string;
  folderId?: string;
}

export default function Editor({ title, folderId }: EditorProps) {
  const params = useParams();
  const campaignId = params.id as string;
  const docId = params.docId as string;
  const updateDocument = useUpdateDocument();

  const ydoc = useMemo(() => new Y.Doc(), []);

  useEffect(() => {
    if (!docId) return;

    const provider = new WebsocketProvider(
      "ws://localhost:8080",
      `ws/doc/${docId}`,
      ydoc,
    );

    return () => {
      provider.destroy();
    };
  }, [docId, ydoc]);

  const debouncedSave = useDebouncedCallback((jsonContent) => {
    updateDocument.mutate({
      campaignId: campaignId,
      documentId: docId,
      title: title,
      folderID: folderId,
      content: jsonContent,
    });
  }, 1000);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ history: false }),
      Collaboration.configure({ document: ydoc }),
    ],
    onUpdate: ({ editor }) => {
      debouncedSave(editor.getJSON());
    },
  });

  if (!editor) {
    return null;
  }

  return <EditorContent editor={editor} />;
}
