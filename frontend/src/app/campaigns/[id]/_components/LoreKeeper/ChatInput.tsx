"use client";

import SendIcon from "@mui/icons-material/Send";
import { Box, CircularProgress, IconButton, TextField } from "@mui/material";
import { KeyboardEvent, useCallback, useState } from "react";
import { useLocale } from "@/lib/i18n";

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  isLoading: boolean;
  isDisabled: boolean;
}

export function ChatInput({ onSend, isLoading, isDisabled }: ChatInputProps) {
  const { t } = useLocale();
  const [value, setValue] = useState("");

  const handleSend = useCallback(async () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading || isDisabled) return;
    setValue("");
    await onSend(trimmed);
  }, [value, isLoading, isDisabled, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        gap: 1,
        px: 2,
        py: 1.5,
      }}
    >
      <TextField
        id="lorena-chat-input"
        fullWidth
        multiline
        maxRows={4}
        placeholder={
          isDisabled
            ? t.lorena.inputDisabled
            : t.lorena.inputPlaceholder
        }
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        size="small"
        variant="outlined"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            fontSize: "0.875rem",
            bgcolor: "rgba(255,255,255,0.03)",
            "& fieldset": {
              borderColor: "rgba(212, 175, 55, 0.2)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(212, 175, 55, 0.35)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgba(212, 175, 55, 0.6)",
            },
            "&.Mui-disabled fieldset": {
              borderColor: "rgba(255,255,255,0.05)",
            },
          },
          "& .MuiInputBase-input": {
            "&::placeholder": {
              color: "text.secondary",
              opacity: 0.6,
              fontSize: "0.85rem",
            },
          },
        }}
      />

      <IconButton
        id="lorena-send-button"
        onClick={handleSend}
        disabled={!value.trim() || isLoading || isDisabled}
        sx={{
          width: 38,
          height: 38,
          flexShrink: 0,
          bgcolor: "rgba(212, 175, 55, 0.12)",
          border: "1px solid rgba(212, 175, 55, 0.25)",
          color: "primary.main",
          borderRadius: "10px",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "rgba(212, 175, 55, 0.2)",
            borderColor: "primary.main",
          },
          "&.Mui-disabled": {
            bgcolor: "rgba(255,255,255,0.03)",
            color: "text.secondary",
            borderColor: "rgba(255,255,255,0.05)",
          },
        }}
      >
        {isLoading ? (
          <CircularProgress size={16} sx={{ color: "primary.main" }} />
        ) : (
          <SendIcon sx={{ fontSize: 18 }} />
        )}
      </IconButton>
    </Box>
  );
}
