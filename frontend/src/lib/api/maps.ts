import { MapDetail, MapMarker, MapSummary } from "../types/Map";
import { MessageResponse } from "../types/GeneralTypes";
import { apiClient } from "./client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function List(campaignID: string): Promise<MapSummary[]> {
  const resp = await apiClient.get(
    `/api/campaigns/${campaignID}/maps`,
  );
  return resp.data;
}

export async function GetByID(
  campaignID: string,
  mapID: string,
): Promise<MapDetail> {
  const resp = await apiClient.get(
    `/api/campaigns/${campaignID}/maps/${mapID}`,
  );
  return resp.data;
}

export async function Upload(
  campaignID: string,
  name: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<MapDetail> {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("file", file);

  const resp = await apiClient.post(
    `/api/campaigns/${campaignID}/maps`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    },
  );
  return resp.data;
}

export async function Update(
  campaignID: string,
  mapID: string,
  name: string,
): Promise<MapDetail> {
  const resp = await apiClient.put(
    `/api/campaigns/${campaignID}/maps/${mapID}`,
    { name },
  );
  return resp.data;
}

export async function Delete(
  campaignID: string,
  mapID: string,
): Promise<MessageResponse> {
  const resp = await apiClient.delete(
    `/api/campaigns/${campaignID}/maps/${mapID}`,
  );
  return resp.data;
}

export function GetImageURL(campaignID: string, mapID: string): string {
  return `${API_URL}/api/campaigns/${campaignID}/maps/${mapID}/image`;
}

export async function SyncMarkers(
  campaignID: string,
  mapID: string,
  markers: Omit<MapMarker, "id" | "map_id" | "created_at">[],
): Promise<MessageResponse> {
  const resp = await apiClient.post(
    `/api/campaigns/${campaignID}/maps/${mapID}/markers`,
    { markers },
  );
  return resp.data;
}
