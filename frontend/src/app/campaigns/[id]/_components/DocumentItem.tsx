"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useParams, useRouter } from "next/navigation";
import { DocumentSummary } from "@/lib/types/Documents";

interface DocumentItemProps {
  document: DocumentSummary;
}

export default function DocumentItem({ document }: DocumentItemProps) {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  const docId = params.docId as string;
  const isActive = docId === document.id;

  return (
    <Box
      onClick={() => router.push(`/campaigns/${campaignId}/docs/${document.id}`)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 1.5,
        py: 0.7,
        borderRadius: "10px",
        cursor: "pointer",
        transition: "all 0.15s ease",
        bgcolor: isActive ? "rgba(212, 175, 55, 0.1)" : "transparent",
        borderLeft: isActive ? "2px solid" : "2px solid transparent",
        borderColor: isActive ? "primary.main" : "transparent",
        "&:hover": {
          bgcolor: isActive
            ? "rgba(212, 175, 55, 0.12)"
            : "rgba(212, 175, 55, 0.06)",
        },
      }}
    >
      <DescriptionOutlinedIcon
        sx={{
          fontSize: "1rem",
          color: isActive ? "primary.main" : "text.secondary",
          flexShrink: 0,
        }}
      />
      <Typography
        variant="body2"
        sx={{
          color: isActive ? "primary.main" : "text.primary",
          fontSize: "0.83rem",
          fontWeight: isActive ? 600 : 500,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
        }}
      >
        {document.title}
      </Typography>
      {document.isSpoiler && (
        <LockOutlinedIcon
          sx={{
            fontSize: "0.85rem",
            color: "error.main",
            opacity: 0.7,
            flexShrink: 0,
          }}
        />
      )}
    </Box>
  );
}
