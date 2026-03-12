import { Folder } from "../types/Folder"
import { MessageResponse } from "../types/GeneralTypes"
import { apiClient } from "./client"

export async function List(campaignID: string): Promise<Folder[]> {
    try {
        const resp = await apiClient.get(`/api/campaigns/${campaignID}/folders`)
        return resp.data
    } catch (error) {
        console.error("Falha ao listar pastas: ", error)
        throw error;
    }
}

export async function GetByID(campaignID: string, folderID: string): Promise<Folder> {
    try {
        const resp = await apiClient.get(`/api/campaigns/${campaignID}/folders/${folderID}`)
        return resp.data
    } catch (error) {
        console.error("Falha ao recuperar informações da pasta: ", error)
        throw error;
    }
}

export async function Create(campaignID: string, name: string, parentID?: string): Promise<MessageResponse> {
    try {
        const resp = await apiClient.post(`/api/campaigns/${campaignID}/folders`, { name, parentID })
        return resp.data
    } catch (error) {
        console.error("Falha ao criar a pasta: ", error)
        throw error;
    }
}

export async function Update(campaignID: string, name: string, position?: number, parentID?: string): Promise<Folder> {
    try {
        const resp = await apiClient.put(`/api/campaigns/${campaignID}/folders`, { name, position, parentID })
        return resp.data
    } catch (error) {
        console.error("Falha ao atualizar pasta: ", error)
        throw error;
    }
}

export async function Delete(campaignID: string): Promise<MessageResponse> {
    try {
        const resp = await apiClient.delete(`/api/campaigns/${campaignID}/folders`)
        return resp.data
    } catch (error) {
        console.error("Falha ao apagar pasta: ", error)
        throw error;
    }
}