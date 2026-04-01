"use client";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, IconButton, Tooltip } from "@mui/material";

interface SidebarToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
  desktopWidth: number;
}

export default function SidebarToggleButton({
  isOpen,
  onClick,
  desktopWidth,
}: SidebarToggleButtonProps) {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        position: "absolute",
        zIndex: 20,
        left: isOpen ? desktopWidth - 14 : 0,
        top: "50%",
        transform: "translateY(-50%)",
        transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <Tooltip
        title={isOpen ? "Esconder barra lateral" : "Mostrar barra lateral"}
        placement="right"
      >
        <IconButton
          onClick={onClick}
          size="small"
          sx={{
            bgcolor: "background.paper",
            border: "1px solid rgba(212, 175, 55, 0.2)",
            color: "text.secondary",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            borderRadius: isOpen ? "50%" : "0 8px 8px 0",
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
            <KeyboardArrowLeftIcon fontSize="small" />
          ) : (
            <KeyboardArrowRightIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
