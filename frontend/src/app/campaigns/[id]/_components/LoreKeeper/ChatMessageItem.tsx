"use client";

import ReactMarkdown from "react-markdown";
import { ChatMessage } from "@/lib/api/chat";
import { Avatar, Box, Typography } from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PersonIcon from "@mui/icons-material/Person";

interface ChatMessageItemProps {
  message: ChatMessage;
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isAssistant = message.role === "assistant";

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.25,
        alignItems: "flex-start",
        flexDirection: isAssistant ? "row" : "row-reverse",
        animation: "fadeSlideIn 0.25s ease-out",
        "@keyframes fadeSlideIn": {
          from: { opacity: 0, transform: "translateY(8px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* Avatar */}
      <Avatar
        sx={{
          width: 30,
          height: 30,
          flexShrink: 0,
          bgcolor: isAssistant
            ? "rgba(212, 175, 55, 0.12)"
            : "rgba(142, 36, 170, 0.15)",
          border: "1px solid",
          borderColor: isAssistant
            ? "rgba(212, 175, 55, 0.3)"
            : "rgba(142, 36, 170, 0.3)",
          mt: 0.25,
        }}
      >
        {isAssistant ? (
          <AutoStoriesIcon sx={{ fontSize: 16, color: "primary.main" }} />
        ) : (
          <PersonIcon sx={{ fontSize: 16, color: "secondary.main" }} />
        )}
      </Avatar>

      {/* Bolha de mensagem */}
      <Box
        sx={{
          maxWidth: "82%",
          px: 1.75,
          py: 1.25,
          borderRadius: isAssistant
            ? "4px 16px 16px 16px"
            : "16px 4px 16px 16px",
          bgcolor: isAssistant
            ? "rgba(212, 175, 55, 0.06)"
            : "rgba(142, 36, 170, 0.12)",
          border: "1px solid",
          borderColor: isAssistant
            ? "rgba(212, 175, 55, 0.12)"
            : "rgba(142, 36, 170, 0.2)",
        }}
      >
        {isAssistant ? (
          // Renderizar markdown nas respostas da Lorena
          <Box
            sx={{
              fontSize: "0.875rem",
              lineHeight: 1.65,
              color: "text.primary",
              "& p": { m: 0, mb: 0.75, "&:last-child": { mb: 0 } },
              "& h1,& h2,& h3,& h4": {
                color: "primary.light",
                fontFamily: '"Merriweather", serif',
                mt: 1,
                mb: 0.5,
                fontSize: "0.9rem",
                fontWeight: 700,
              },
              "& strong": { color: "primary.light", fontWeight: 700 },
              "& em": { color: "text.secondary", fontStyle: "italic" },
              "& ul, & ol": { pl: 2, m: 0, mb: 0.75 },
              "& li": { mb: 0.25 },
              "& code": {
                bgcolor: "rgba(0,0,0,0.3)",
                px: 0.5,
                py: 0.1,
                borderRadius: 1,
                fontFamily: "monospace",
                fontSize: "0.82rem",
              },
              "& hr": { borderColor: "rgba(212,175,55,0.15)", my: 1 },
              "& a": { color: "primary.main" },
            }}
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </Box>
        ) : (
          <Typography
            variant="body2"
            sx={{ fontSize: "0.875rem", lineHeight: 1.6, color: "text.primary" }}
          >
            {message.content}
          </Typography>
        )}

        {/* Horário da mensagem */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: isAssistant ? "left" : "right",
            color: "text.secondary",
            fontSize: "0.67rem",
            mt: 0.5,
            opacity: 0.7,
          }}
        >
          {new Date(message.createdAt).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </Box>
    </Box>
  );
}
