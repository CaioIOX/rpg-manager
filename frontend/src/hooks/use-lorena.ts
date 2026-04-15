"use client";

import { useCallback, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChatMessage,
  ChatUsage,
  GetUsage,
  LorenaRateLimitError,
  SendMessage,
} from "@/lib/api/chat";

let messageIdCounter = 0;
function generateId() {
  return `msg-${Date.now()}-${++messageIdCounter}`;
}

interface UseLorenaReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  usage: ChatUsage | undefined;
  isRateLimited: boolean;
  rateLimitMessage: string;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (text: string) => Promise<void>;
  clearHistory: () => void;
}

export function useLorena(campaignID: string): UseLorenaReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState("");

  // Mantém referência ao histórico atual para leitura sempre atualizada dentro do callback
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  // Busca o status de uso da API (com refetch automático ao abrir o chat)
  const { data: usage, refetch: refetchUsage } = useQuery<ChatUsage>({
    queryKey: ["chat-usage", campaignID],
    queryFn: () => GetUsage(campaignID),
    enabled: isOpen, // só busca quando o chat está aberto
    staleTime: 0,
  });

  const openChat = useCallback(() => {
    setIsOpen(true);
    refetchUsage();
  }, [refetchUsage]);

  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) refetchUsage();
      return !prev;
    });
  }, [refetchUsage]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setIsRateLimited(false);
    setRateLimitMessage("");
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading || isRateLimited) return;

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: text.trim(),
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Histórico que será enviado ao backend (somente as mensagens anteriores, sem a atual)
      const historyForApi = messagesRef.current.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        const resp = await SendMessage(campaignID, text.trim(), historyForApi);

        const assistantMessage: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: resp.content,
          createdAt: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
        refetchUsage();
      } catch (err) {
        if (err instanceof LorenaRateLimitError) {
          setIsRateLimited(true);
          setRateLimitMessage(err.message);
          // Adicionar mensagem de erro da Lorena no chat para UX fluida
          const limitMsg: ChatMessage = {
            id: generateId(),
            role: "assistant",
            content: err.message,
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, limitMsg]);
        } else {
          const errorMsg: ChatMessage = {
            id: generateId(),
            role: "assistant",
            content:
              "Minhas páginas ficaram embaralhadas... Tente novamente em breve. 📜",
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, errorMsg]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [campaignID, isLoading, isRateLimited, refetchUsage],
  );

  return {
    messages,
    isLoading,
    isOpen,
    usage,
    isRateLimited,
    rateLimitMessage,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    clearHistory,
  };
}
