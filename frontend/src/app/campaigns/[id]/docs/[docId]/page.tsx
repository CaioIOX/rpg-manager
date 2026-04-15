"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useDebouncedCallback } from "use-debounce";
import useGetDocument from "@/lib/hooks/useGetDocument";
import useGetTemplate from "@/lib/hooks/useGetTemplate";
import useUpdateDocument from "@/lib/hooks/useUpdateDocument";
import Editor, { type EditorHandle } from "./_components/Editor";
import TemplateFields from "./_components/TemplateFields";
import TemplateSidePanel from "./_components/TemplateSidePanel";
import TemplatePanelToggle from "./_components/TemplatePanelToggle";

// ─── Loading state ────────────────────────────────────────────────────────────

function DocLoadingSpinner() {
  return (
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
  );
}

// ─── Document title ───────────────────────────────────────────────────────────

function DocTitle({ title }: { title: string }) {
  return (
    <Typography
      variant="h4"
      sx={{
        fontWeight: 700,
        mb: 0,
        px: { xs: 0.5, sm: 1 },
        background: "linear-gradient(135deg, #E6E6E6 0%, #8B949E 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
      }}
    >
      {title}
    </Typography>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DocPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const docId = params.docId as string;

  const getDocument = useGetDocument(campaignId, docId);
  const updateDocument = useUpdateDocument();

  const templateId = getDocument.data?.template_id;
  const template = useGetTemplate(campaignId, templateId);

  // Desktop: template panel open by default when a template exists
  const [isTemplatePanelOpen, setIsTemplatePanelOpen] = useState(true);

  // Ref to the Editor — used to trigger mention resync when template data changes
  const editorRef = useRef<EditorHandle>(null);

  // Always up-to-date template field values; passed to Editor so it can include
  // template @mentions in its SyncLinks call without prop drilling
  const templateDataRef = useRef<Record<string, string>>({});

  const debouncedSaveTemplateData = useDebouncedCallback(
    (templateData: Record<string, string>) => {
      // Keep the shared ref in sync
      templateDataRef.current = templateData;

      const existingContent =
        (getDocument.data?.content as Record<string, unknown>) ?? {};
      updateDocument.mutate({
        campaignId,
        documentId: docId,
        content: { ...existingContent, templateData },
      });

      // Tell the editor to re-run its mention sync so template mentions are
      // included the next time the editor fires a save (even without typing)
      editorRef.current?.resyncMentions();
    },
    800,
  );

  const templateInitialData = (
    getDocument.data?.content as Record<string, unknown>
  )?.templateData as Record<string, string> | undefined;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        animation: "fadeIn 0.4s ease-out",
      }}
    >
      {getDocument.isPending ? (
        <DocLoadingSpinner />
      ) : (
        <>
          {/* ── Title bar ── */}
          {getDocument.data?.title && (
            <Box
              sx={{
                px: { xs: 1.5, sm: 2, md: 4 },
                pt: { xs: 1.5, sm: 2, md: 4 },
                pb: 0,
              }}
            >
              <DocTitle title={getDocument.data.title} />
            </Box>
          )}

          {/* ── Mobile: inline template fields (collapsed by default) ── */}
          {template.data && (
            <Box
              sx={{
                display: { xs: "block", md: "none" },
                px: { xs: 1.5, sm: 2 },
                pt: 2,
              }}
            >
              <TemplateFields
                variant="inline"
                template={template.data}
                initialData={templateInitialData}
                campaignId={campaignId}
                onChange={debouncedSaveTemplateData}
              />
            </Box>
          )}

          {/* ── Desktop: two-column layout (editor + template sidebar) ── */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              position: "relative",
              // align-items: flex-start is required for position:sticky children
              alignItems: "flex-start",
            }}
          >
            {/* Editor column */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                px: { xs: 1.5, sm: 2, md: 4 },
                pb: { xs: 2, md: 4 },
              }}
            >
              <Editor
                ref={editorRef}
                title={getDocument.data?.title}
                folderId={getDocument.data?.folder_id}
                initialContent={
                  getDocument.data?.content as Record<string, unknown>
                }
                templateDataRef={templateDataRef}
              />
            </Box>

            {/* Desktop template side panel */}
            {template.data && (
              <>
                <TemplateSidePanel
                  isOpen={isTemplatePanelOpen}
                  template={template.data}
                  initialData={templateInitialData}
                  campaignId={campaignId}
                  onChange={debouncedSaveTemplateData}
                />
                <TemplatePanelToggle
                  isOpen={isTemplatePanelOpen}
                  onClick={() => setIsTemplatePanelOpen((p) => !p)}
                />
              </>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
