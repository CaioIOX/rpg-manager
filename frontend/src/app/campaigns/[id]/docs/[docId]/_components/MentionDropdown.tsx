"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DocumentSummary } from "@/lib/types/Documents";

interface MentionDropdownProps {
  items: DocumentSummary[];
  selectedIndex: number;
  onSelect: (item: DocumentSummary) => void;
}

export default function MentionDropdown({
  items,
  selectedIndex,
  onSelect,
}: MentionDropdownProps) {
  if (items.length === 0) {
    return (
      <Box
        sx={{
          p: 1.5,
          bgcolor: "rgba(22, 27, 34, 0.97)",
          border: "1px solid rgba(212, 175, 55, 0.2)",
          borderRadius: "8px",
          color: "text.secondary",
        }}
      >
        <Typography variant="body2">Nenhum documento encontrado</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 0.5,
        bgcolor: "rgba(22, 27, 34, 0.97)",
        border: "1px solid rgba(212, 175, 55, 0.2)",
        borderRadius: "8px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        minWidth: 200,
        maxHeight: 240,
        overflowY: "auto",
      }}
    >
      {items.map((item, index) => (
        <Box
          key={item.id}
          onMouseDown={(e) => {
            // prevent blur of the input that triggered this
            e.preventDefault();
            onSelect(item);
          }}
          sx={{
            px: 2,
            py: 0.875,
            cursor: "pointer",
            borderRadius: "6px",
            bgcolor:
              index === selectedIndex
                ? "rgba(186, 104, 200, 0.2)"
                : "transparent",
            "&:hover": { bgcolor: "rgba(186, 104, 200, 0.12)" },
            transition: "background-color 0.1s ease",
          }}
        >
          <Typography variant="body2" sx={{ color: "#fff", lineHeight: 1.4 }}>
            {item.title}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
