import { Folder } from "../types/Folder"
import { MessageResponse } from "../types/GeneralTypes"
import { apiClient } from "./client"

export async function List(campaignID: string): Promise<Folder[]> {
    try {
        const resp = await apiClient.get(`/api/campaigns/${campaignID}/folders`)
        return resp.data
    } catch (error) {
        throw error;
    }
}

export async function GetByID(campaignID: string, folderID: string): Promise<Folder> {
    try {
        const resp = await apiClient.get(`/api/campaigns/${campaignID}/folders/${folderID}`)
        return resp.data
    } catch (error) {
        throw error;
    }
}

export async function Create(campaignID: string, name: string, parentID?: string, color?: string): Promise<MessageResponse> {
    try {
        const resp = await apiClient.post(`/api/campaigns/${campaignID}/folders`, { name, parent_id: parentID, color })
        return resp.data
    } catch (error) {
        throw error;
    }
}

export async function Update(campaignID: string, folderID: string, name: string, position?: number, parentID?: string, color?: string): Promise<Folder> {
    try {
        const resp = await apiClient.put(`/api/campaigns/${campaignID}/folders/${folderID}`, { name, position, parent_id: parentID, color })
        return resp.data
    } catch (error) {
        throw error;
    }
}

export async function Delete(campaignID: string, folderID: string): Promise<MessageResponse> {
    try {
        const resp = await apiClient.delete(`/api/campaigns/${campaignID}/folders/${folderID}`)
        return resp.data
    } catch (error) {
        throw error;
    }
}
