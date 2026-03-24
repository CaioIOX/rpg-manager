import {
  TypeDocument,
  DocumentLink,
  DocumentSummary,
} from "../types/Documents";
import { MessageResponse } from "../types/GeneralTypes";
import { apiClient } from "./client";

interface LinksResponse {
  links_from: DocumentLink[];
  links_to: DocumentLink[];
}

export async function List(campaignID: string): Promise<DocumentSummary[]> {
  try {
    const resp = await apiClient.get(`/api/campaigns/${campaignID}/documents`);
    return resp.data;
  } catch (error) {
    console.error("Falha ao listar os documentos: ", error);
    throw error;
  }
}

export async function GetByID(
  campaignID: string,
  documentID: string,
): Promise<TypeDocument> {
  try {
    const resp = await apiClient.get(
      `/api/campaigns/${campaignID}/documents/${documentID}`,
    );
    return resp.data;
  } catch (error) {
    console.error("Falha ao recuperar informações dos documentos: ", error);
    throw error;
  }
}

export async function Create(
  campaignID: string,
  title: string,
  content?: Record<string, unknown>,
  folderID?: string,
  templateID?: string,
  isSpoiler?: boolean,
): Promise<MessageResponse> {
  try {
    const resp = await apiClient.post(
      `/api/campaigns/${campaignID}/documents`,
      {
        title,
        content: content || {},
        folder_id: folderID || null,
        template_id: templateID || null,
        is_spoiler: isSpoiler ?? false,
      },
    );
    return resp.data;
  } catch (error) {
    console.error("Falha ao criar o documento: ", error);
    throw error;
  }
}

export async function Update(
  campaignID: string,
  documentID: string,
  title?: string,
  folderID?: string,
  content?: Record<string, unknown>,
  isSpoiler?: boolean,
): Promise<TypeDocument> {
  console.log(title, folderID, content, isSpoiler);
  try {
    const resp = await apiClient.put(
      `/api/campaigns/${campaignID}/documents/${documentID}`,
      { title, folder_id: folderID, content, is_spoiler: isSpoiler },
    );
    return resp.data;
  } catch (error) {
    console.error("Falha ao atualizar o documento: ", error);
    throw error;
  }
}

export async function Delete(
  campaignID: string,
  documentID: string,
): Promise<MessageResponse> {
  try {
    const resp = await apiClient.delete(
      `/api/campaigns/${campaignID}/documents/${documentID}`,
    );
    return resp.data;
  } catch (error) {
    console.error("Falha ao apagar o documento: ", error);
    throw error;
  }
}

export async function GetLinks(
  campaignID: string,
  documentID: string,
): Promise<LinksResponse> {
  try {
    const resp = await apiClient.get(
      `/api/campaigns/${campaignID}/documents/${documentID}/links`,
    );
    return resp.data;
  } catch (error) {
    console.error("Falha ao recuperar menções: ", error);
    throw error;
  }
}

export async function Search(
  campaignID: string,
  q: string,
): Promise<DocumentSummary[]> {
  try {
    const resp = await apiClient.get(`/api/campaigns/${campaignID}/search`, {
      params: { q },
    });
    return resp.data;
  } catch (error) {
    console.error("Consulta não encontrada: ", error);
    throw error;
  }
}

export async function SyncLinks(
  campaignID: string,
  documentID: string,
  links: { target_doc_id: string; mention_text: string }[],
): Promise<MessageResponse> {
  try {
    const resp = await apiClient.post(
      `/api/campaigns/${campaignID}/documents/${documentID}/links`,
      { links },
    );
    return resp.data;
  } catch (error) {
    console.error("Falha ao sincronizar as menções: ", error);
    throw error;
  }
}
