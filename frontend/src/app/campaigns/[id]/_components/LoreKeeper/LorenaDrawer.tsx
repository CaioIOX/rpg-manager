"use client";

import { useLorena } from "@/hooks/use-lorena";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Box,
  Divider,
  Drawer,
  Fab,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useRef } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessageItem } from "./ChatMessageItem";
import { LorenaTypingIndicator } from "./LorenaTypingIndicator";
import { LorenaWelcome } from "./LorenaWelcome";

interface LorenaDrawerProps {
  campaignID: string;
}

const DRAWER_WIDTH = 400;

export default function LorenaDrawer({ campaignID }: LorenaDrawerProps) {
  const {
    messages,
    isLoading,
    isOpen,
    usage,
    isRateLimited,
    toggleChat,
    closeChat,
    sendMessage,
    clearHistory,
  } = useLorena(campaignID);

  // Scroll automático para a última mensagem
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const isPremium = usage?.messages_limit === -1;
  const messagesRemaining =
    !isPremium && usage
      ? Math.max(0, usage.messages_limit - usage.messages_used)
      : null;

  return (
    <>
      {/* FAB — Botão flutuante para abrir a Lorena */}
      <Tooltip title="Consultar Lorena — Grimório da Campanha" placement="left">
        <Fab
          id="lorena-fab-button"
          onClick={toggleChat}
          sx={{
            position: "fixed",
            bottom: { xs: 20, md: 28 },
            right: { xs: 20, md: 28 },
            zIndex: 1200,
            bgcolor: isOpen
              ? "rgba(212, 175, 55, 0.15)"
              : "background.paper",
            border: "1.5px solid",
            borderColor: isOpen
              ? "primary.main"
              : "rgba(212, 175, 55, 0.3)",
            color: "primary.main",
            width: 56,
            height: 56,
            boxShadow: isOpen
              ? "0 0 20px rgba(212, 175, 55, 0.3), 0 4px 20px rgba(0,0,0,0.5)"
              : "0 4px 20px rgba(0,0,0,0.5)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              bgcolor: "rgba(212, 175, 55, 0.15)",
              borderColor: "primary.main",
              boxShadow: "0 0 28px rgba(212, 175, 55, 0.35), 0 6px 24px rgba(0,0,0,0.6)",
              transform: "translateY(-2px) scale(1.05)",
            },
          }}
        >
          <AutoStoriesIcon
            sx={{
              fontSize: 26,
              transition: "transform 0.3s ease",
              transform: isOpen ? "rotate(-10deg)" : "none",
            }}
          />
        </Fab>
      </Tooltip>

      {/* Drawer lateral */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={closeChat}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "min(92vw, 380px)", md: DRAWER_WIDTH },
              bgcolor: "background.paper",
              backgroundImage: "none",
              border: "none",
              borderLeft: "1px solid rgba(212, 175, 55, 0.12)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            },
          },
        }}
        sx={{
          zIndex: 1300,
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 1.75,
            borderBottom: "1px solid rgba(212, 175, 55, 0.1)",
            background:
              "linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(22,27,34,0) 100%)",
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <AutoStoriesIcon
              sx={{ color: "primary.main", fontSize: 22 }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  lineHeight: 1.2,
                  fontSize: "1rem",
                }}
              >
                Lorena
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "text.secondary", fontSize: "0.72rem" }}
              >
                Grimório da Campanha
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 0.5 }}>
            {messages.length > 0 && (
              <Tooltip title="Limpar conversa">
                <IconButton
                  id="lorena-clear-history"
                  onClick={clearHistory}
                  size="small"
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "error.main" },
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <IconButton
              id="lorena-close-drawer"
              onClick={closeChat}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Indicador de uso (somente free users) */}
        {!isPremium && usage && (
          <Box
            sx={{
              px: 2.5,
              py: 1,
              bgcolor: "rgba(212, 175, 55, 0.04)",
              borderBottom: "1px solid rgba(212, 175, 55, 0.06)",
              flexShrink: 0,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color:
                  messagesRemaining === 0
                    ? "error.main"
                    : messagesRemaining !== null && messagesRemaining <= 1
                    ? "warning.main"
                    : "text.secondary",
                fontSize: "0.71rem",
              }}
            >
              {messagesRemaining === 0
                ? "Lorena está cansada por hoje 📚"
                : `${messagesRemaining} consulta${messagesRemaining !== 1 ? "s" : ""} restante${messagesRemaining !== 1 ? "s" : ""} hoje`}
            </Typography>
          </Box>
        )}

        <Divider sx={{ borderColor: "transparent", flexShrink: 0 }} />

        {/* Área de mensagens */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            px: 2,
            py: 1.5,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            "&::-webkit-scrollbar": { width: "4px" },
            "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "rgba(212, 175, 55, 0.15)",
              borderRadius: "4px",
            },
          }}
        >
          {messages.length === 0 ? (
            <LorenaWelcome />
          ) : (
            messages.map((msg) => (
              <ChatMessageItem key={msg.id} message={msg} />
            ))
          )}

          {isLoading && <LorenaTypingIndicator />}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box
          sx={{
            flexShrink: 0,
            borderTop: "1px solid rgba(212, 175, 55, 0.1)",
          }}
        >
          <ChatInput
            onSend={sendMessage}
            isLoading={isLoading}
            isDisabled={isRateLimited}
          />
        </Box>
      </Drawer>
    </>
  );
}
