"use client";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type JSONContent } from "@tiptap/react";

interface ConnectedUser {
  name: string;
  color: string;
  clientId: number;
}

const USER_COLORS = [
  "#D4AF37", // gold
  "#BA68C8", // purple
  "#58A6FF", // blue
  "#3FB950", // green
  "#F0883E", // orange
  "#F85149", // red
  "#79C0FF", // light blue
  "#E8CC6E", // light gold
];

function getColorForUser(clientId: number): string {
  return USER_COLORS[clientId % USER_COLORS.length];
}

interface UseCollaborationOptions {
  docId: string;
  username: string;
  initialContent?: Record<string, unknown>;
}

export default function useCollaboration({
  docId,
  username,
  initialContent,
}: UseCollaborationOptions) {
  const ydoc = useMemo(() => new Y.Doc(), []);
  const hasInitializedRef = useRef(false);
  const syncedRef = useRef(false);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);

  const attemptInitialLoad = useCallback(
    (editor: any) => {
      if (!editor) return;
      if (!initialContent) return;
      if (hasInitializedRef.current) return;

      const fragment = ydoc.getXmlFragment("prosemirror");
      const hasYContent = fragment && fragment.length > 0;
      if (hasYContent) {
        hasInitializedRef.current = true;
        return;
      }

      const peers = providerRef.current?.awareness.getStates().size ?? 1;
      if (peers > 1 && !syncedRef.current) {
        return;
      }

      const contentToLoad: JSONContent = {
        type:
          typeof initialContent.type === "string"
            ? initialContent.type
            : "doc",
        content: Array.isArray(initialContent.content)
          ? (initialContent.content as JSONContent[])
          : [],
      };

      editor.commands.setContent(contentToLoad);
      hasInitializedRef.current = true;
    },
    [initialContent, ydoc],
  );

  const provider = useMemo(() => {
    if (typeof window === "undefined" || !docId) return null;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const wsBaseUrl = process.env.NEXT_PUBLIC_WS_URL || `${protocol}//${host}`;

    const p = new WebsocketProvider(
      wsBaseUrl,
      `ws/doc/${docId}?user_name=${encodeURIComponent(username)}`,
      ydoc,
    );
    return p;
  }, [docId, username, ydoc]);

  useEffect(() => {
    if (provider) {
      providerRef.current = provider;
    }
  }, [provider]);

  useEffect(() => {
    if (!provider) return;

    // Set local awareness state with user info
    const localColor = getColorForUser(ydoc.clientID);
    provider.awareness.setLocalStateField("user", {
      name: username,
      color: localColor,
    });

    // Track connected users
    const updateUsers = () => {
      const states = provider.awareness.getStates();
      const users: ConnectedUser[] = [];
      states.forEach((state, clientId) => {
        if (state.user) {
          users.push({
            name: state.user.name || "Anônimo",
            color: state.user.color || getColorForUser(clientId),
            clientId,
          });
        }
      });
      setConnectedUsers(users);
    };

    provider.awareness.on("change", updateUsers);
    updateUsers();

    return () => {
      provider.awareness.off("change", updateUsers);
      // destruction is handled by the useMemo provider's own lifecycle or 
      // we can do it here if we want to be explicit, but the provider 
      // is reused by useMemo. Actually, better destroy it here.
      provider.destroy();
      providerRef.current = null;
    };
  }, [provider, ydoc, username]);

  return {
    ydoc,
    provider,
    providerRef,
    connectedUsers,
    syncedRef,
    attemptInitialLoad,
  };
}
