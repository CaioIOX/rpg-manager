"use client";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

interface TemplatePanelToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function TemplatePanelToggle({
  isOpen,
  onClick,
}: TemplatePanelToggleProps) {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        position: "absolute",
        zIndex: 20,
        // Anchored to the right edge of the content area / left edge of panel
        right: isOpen ? 300 - 14 : 0,
        top: "50%",
        transform: "translateY(-50%)",
        transition: "right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <Tooltip
        title={isOpen ? "Esconder template" : "Mostrar template"}
        placement="left"
      >
        <IconButton
          onClick={onClick}
          size="small"
          sx={{
            bgcolor: "background.paper",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            color: "text.secondary",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            borderRadius: isOpen ? "50%" : "8px 0 0 8px",
            width: isOpen ? 28 : 24,
            height: isOpen ? 28 : 48,
            "&:hover": {
              bgcolor: "background.paper",
              color: "primary.main",
              borderColor: "primary.main",
            },
          }}
        >
          {isOpen ? (
            <KeyboardArrowRightIcon fontSize="small" />
          ) : (
            <KeyboardArrowLeftIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
