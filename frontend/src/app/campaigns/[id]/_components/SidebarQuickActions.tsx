"use client";

import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import SettingsIcon from "@mui/icons-material/Settings";
import MapIcon from "@mui/icons-material/Map";
import { Button, Stack } from "@mui/material";

interface SidebarQuickActionsProps {
  onCreateDoc: () => void;
  onCreateFolder: () => void;
  onCreateTemplate: () => void;
  onCreateMap: () => void;
}

const actions = [
  {
    key: "doc",
    label: "Doc",
    icon: <AddIcon sx={{ fontSize: "1rem" }} />,
  },
  {
    key: "folder",
    label: "Pasta",
    icon: <FolderIcon sx={{ fontSize: "1rem" }} />,
  },
  {
    key: "template",
    label: "Template",
    icon: <SettingsIcon sx={{ fontSize: "1rem" }} />,
  },
  {
    key: "map",
    label: "Mapa",
    icon: <MapIcon sx={{ fontSize: "1rem" }} />,
  },
] as const;

export default function SidebarQuickActions({
  onCreateDoc,
  onCreateFolder,
  onCreateTemplate,
  onCreateMap,
}: SidebarQuickActionsProps) {
  const handlers = {
    doc: onCreateDoc,
    folder: onCreateFolder,
    template: onCreateTemplate,
    map: onCreateMap,
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      sx={{
        p: 1.5,
        borderBottom: "1px solid",
        borderColor: "rgba(212, 175, 55, 0.06)",
      }}
    >
      {actions.map((action) => (
        <Button
          key={action.key}
          size="small"
          variant="text"
          color="inherit"
          startIcon={action.icon}
          onClick={handlers[action.key]}
          sx={{
            flex: 1,
            minHeight: 40,
            fontSize: { xs: "0.82rem", sm: "0.72rem" },
            color: "text.secondary",
            borderRadius: "10px",
            py: 1,
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "rgba(212, 175, 55, 0.06)",
              color: "primary.main",
            },
          }}
        >
          {action.label}
        </Button>
      ))}
    </Stack>
  );
}
