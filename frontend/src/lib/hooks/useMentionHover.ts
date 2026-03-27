"use client";

import { useState, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetByID } from "@/lib/api/documents";
import { DocumentSummary } from "@/lib/types/Documents";

interface HoveredMention {
  docId: string;
  anchorEl: HTMLElement;
}

export default function useMentionHover(campaignId: string) {
  const [hoveredMention, setHoveredMention] = useState<HoveredMention | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queryClient = useQueryClient();

  const hoveredDocId = hoveredMention?.docId ?? null;

  const mentionDataQuery = useQuery({
    queryKey: ["documentDetail", campaignId, hoveredDocId],
    queryFn: () => GetByID(campaignId, hoveredDocId!),
    enabled: !!hoveredDocId && !!campaignId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get the document title from the documents cache for display purposes
  const getDocTitle = useCallback(
    (docId: string): string => {
      const docs = queryClient.getQueryData<DocumentSummary[]>(["documents", campaignId]);
      return docs?.find((d) => d.id === docId)?.title ?? "Documento";
    },
    [campaignId, queryClient],
  );

  const handleMentionMouseEnter = useCallback(
    (docId: string, element: HTMLElement) => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      hoverTimerRef.current = setTimeout(() => {
        setHoveredMention({ docId, anchorEl: element });
      }, 1000);
    },
    [],
  );

  const handleMentionMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    setHoveredMention(null);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  return {
    hoveredMention,
    mentionData: mentionDataQuery.data,
    isMentionLoading: mentionDataQuery.isLoading,
    getDocTitle,
    handleMentionMouseEnter,
    handleMentionMouseLeave,
    handleClose,
  };
}
