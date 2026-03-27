"use client";

import useGetDocument from "@/lib/hooks/useGetDocument";
import useGetTemplate from "@/lib/hooks/useGetTemplate";
import useUpdateDocument from "@/lib/hooks/useUpdateDocument";
import Editor from "./_components/Editor";
import TemplateFields from "./_components/TemplateFields";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useDebouncedCallback } from "use-debounce";

export default function DocPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const docId = params.docId as string;

  const getDocument = useGetDocument(campaignId, docId);
  const updateDocument = useUpdateDocument();

  const templateId = getDocument.data?.template_id;
  const template = useGetTemplate(campaignId, templateId);

  const debouncedSaveTemplateData = useDebouncedCallback(
    (templateData: Record<string, string>) => {
      const existingContent =
        (getDocument.data?.content as Record<string, unknown>) ?? {};
      updateDocument.mutate({
        campaignId,
        documentId: docId,
        content: { ...existingContent, templateData },
      });
    },
    800,
  );

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 4 }, animation: "fadeIn 0.4s ease-out" }}>
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
                maxWidth: "960px",
                mx: "auto",
                mb: 0,
                px: { xs: 0.5, sm: 1, md: 2 },
                background: "linear-gradient(135deg, #E6E6E6 0%, #8B949E 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
              }}
            >
              {getDocument.data.title}
            </Typography>
          )}

          {template.data && (
            <TemplateFields
              template={template.data}
              initialData={
                (getDocument.data?.content as Record<string, unknown>)
                  ?.templateData as Record<string, string> | undefined
              }
              onChange={debouncedSaveTemplateData}
            />
          )}

          <Editor
            title={getDocument.data?.title}
            folderId={getDocument.data?.folder_id}
            initialContent={
              getDocument.data?.content as Record<string, unknown>
            }
          />
        </>
      )}
    </Box>
  );
}
