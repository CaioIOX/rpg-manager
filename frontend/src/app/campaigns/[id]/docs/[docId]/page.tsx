"use client";

import useGetDocument from "@/lib/hooks/useGetDocument";
import Editor from "./_components/Editor";
import { useParams } from "next/navigation";

export default function DocPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const docId = params.docId as string;

  const getDocument = useGetDocument(campaignId, docId);

  return (
    <Editor
      title={getDocument.data?.title}
      folderId={getDocument.data?.folder_id}
    />
  );
}
