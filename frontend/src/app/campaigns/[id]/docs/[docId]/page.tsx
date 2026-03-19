"use client";

import useGetDocument from "@/lib/hooks/useGetDocument";
import Editor from "./_components/Editor";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

export default function DocPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const docId = params.docId as string;

  const getDocument = useGetDocument(campaignId, docId);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, animation: "fadeIn 0.4s ease-out" }}>
      {getDocument.isPending ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress sx={{ color: "primary.main" }} />
        </Box>
      ) : (
        <>
          {getDocument.data?.title && (
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                maxWidth: "800px",
                mx: "auto",
                mb: 0,
                px: 2,
                background:
                  "linear-gradient(135deg, #E6E6E6 0%, #8B949E 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {getDocument.data.title}
            </Typography>
          )}
          <Editor
            title={getDocument.data?.title}
            folderId={getDocument.data?.folder_id}
          />
        </>
      )}
    </Box>
  );
}
