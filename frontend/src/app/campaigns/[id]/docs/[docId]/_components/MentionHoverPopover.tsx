"use client";

import {
  Box,
  CircularProgress,
  Divider,
  Paper,
  Popper,
  Typography,
} from "@mui/material";
import { TypeDocument } from "@/lib/types/Documents";

interface MentionHoverPopoverProps {
  anchorEl: HTMLElement | null;
  mentionData: TypeDocument | undefined;
  isLoading: boolean;
  onClose: () => void;
}

export default function MentionHoverPopover({
  anchorEl,
  mentionData,
  isLoading,
  onClose,
}: MentionHoverPopoverProps) {
  const open = Boolean(anchorEl);

  if (!open) return null;

  // Extract templateData fields for display
  const content = mentionData?.content as Record<string, unknown> | undefined;
  const templateData = content?.templateData as
    | Record<string, string>
    | undefined;

  const hasTemplateData =
    templateData && Object.keys(templateData).length > 0;

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="top-start"
      modifiers={[
        {
          name: "offset",
          options: { offset: [0, 8] },
        },
        {
          name: "flip",
          options: { fallbackPlacements: ["bottom-start", "top-end"] },
        },
      ]}
      sx={{ zIndex: 1400 }}
    >
      <Paper
        onMouseEnter={() => {
          /* keep open when hovering popover */
        }}
        onMouseLeave={onClose}
        elevation={0}
        sx={{
          maxWidth: 280,
          minWidth: 180,
          bgcolor: "rgba(22, 27, 34, 0.97)",
          border: "1px solid rgba(212, 175, 55, 0.15)",
          borderRadius: "12px",
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          overflow: "hidden",
          animation: "fadeIn 0.15s ease-out",
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
            }}
          >
            <CircularProgress size={14} sx={{ color: "#BA68C8" }} />
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Carregando...
            </Typography>
          </Box>
        ) : mentionData ? (
          <>
            {/* Header */}
            <Box
              sx={{
                px: 1.75,
                pt: 1.5,
                pb: hasTemplateData ? 1 : 1.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: "#ce93d8",
                  fontSize: "0.8rem",
                  lineHeight: 1.3,
                }}
              >
                {mentionData.title}
              </Typography>
            </Box>

            {/* Template data fields */}
            {hasTemplateData && (
              <>
                <Divider
                  sx={{ borderColor: "rgba(212, 175, 55, 0.08)", mx: 1.75 }}
                />
                <Box sx={{ px: 1.75, py: 1 }}>
                  {Object.entries(templateData!)
                    .filter(([, value]) => value && String(value).trim())
                    .slice(0, 4) // limit displayed fields
                    .map(([key, value]) => (
                      <Box
                        key={key}
                        sx={{
                          display: "flex",
                          gap: 0.75,
                          mb: 0.4,
                          alignItems: "baseline",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.disabled",
                            fontSize: "0.65rem",
                            textTransform: "capitalize",
                            flexShrink: 0,
                            minWidth: 60,
                          }}
                        >
                          {key.replace(/_/g, " ")}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            fontSize: "0.7rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {String(value)}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              </>
            )}

            {/* Footer hint */}
            <Box
              sx={{
                px: 1.75,
                pb: 1,
                pt: hasTemplateData ? 0 : 0.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "text.disabled",
                  fontSize: "0.6rem",
                  fontStyle: "italic",
                }}
              >
                Clique para abrir o documento
              </Typography>
            </Box>
          </>
        ) : (
          <Box sx={{ p: 1.5 }}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Documento não encontrado
            </Typography>
          </Box>
        )}
      </Paper>
    </Popper>
  );
}
