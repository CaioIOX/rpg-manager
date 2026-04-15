"use client";

import Box from "@mui/material/Box";
import { Template } from "@/lib/types/Template";
import TemplateFields from "./TemplateFields";

const PANEL_WIDTH = 300;

interface TemplateSidePanelProps {
  isOpen: boolean;
  template: Template;
  initialData?: Record<string, string>;
  campaignId: string;
  onChange: (data: Record<string, string>) => void;
}

export default function TemplateSidePanel({
  isOpen,
  template,
  initialData,
  campaignId,
  onChange,
}: TemplateSidePanelProps) {
  return (
    <Box
      sx={{
        // Only rendered on desktop
        display: { xs: "none", md: "block" },
        // Sticky: follows the scroll of the parent scrolling container,
        // always visible at the right side of the viewport
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        height: "100vh",
        flexShrink: 0,
        // Animated width collapse
        width: isOpen ? PANEL_WIDTH : 0,
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        borderLeft: isOpen ? "1px solid rgba(212, 175, 55, 0.08)" : "none",
        bgcolor: "rgba(22, 27, 34, 0.4)",
        overflow: "hidden",
      }}
    >
      {/* Inner container: fixed-width + own scroll, invisible scrollbar */}
      <Box
        sx={{
          width: PANEL_WIDTH,
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          // Top padding aligns the template header with the editor toolbar
          // (matches the editor Box's mt: 4 = 32px)
          pt: 4,
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "rgba(212, 175, 55, 0.15)",
            borderRadius: "4px",
          },
          // Firefox
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(212, 175, 55, 0.15) transparent",
        }}
      >
        <TemplateFields
          variant="panel"
          template={template}
          initialData={initialData}
          campaignId={campaignId}
          onChange={onChange}
        />
      </Box>
    </Box>
  );
}
