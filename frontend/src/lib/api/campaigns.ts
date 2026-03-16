import { Campaign, CampaignDetailsResponse, CampaignWithRole } from "../types/Campaign"
import { MessageResponse } from "../types/GeneralTypes"
import { apiClient } from "./client"

export async function List(): Promise<CampaignWithRole[]> {
    try {
        const resp = await apiClient.get("/api/campaigns")
        return resp.data
    } catch (error) {
        console.error("Falha ao listar campanhas: ", error)
        throw error;
    }
}

export async function GetByID(campaignID: string): Promise<CampaignDetailsResponse> {
    try {
        const resp = await apiClient.get(`/api/campaigns/${campaignID}`)
        return resp.data
    } catch (error) {
        console.error("Falha ao recuperar informações da campanha: ", error)
        throw error;
    }
}

export async function Create(name: string, description?: string): Promise<MessageResponse> {
    try {
        const resp = await apiClient.post(`/api/campaigns/`, { name, description })
        return resp.data
    } catch (error) {
        console.error("Falha ao criar campanha: ", error)
        throw error;
    }
}

export async function AddMember(campaignID: string, email: string, role: string): Promise<MessageResponse> {
    try {
        const resp = await apiClient.post(`/api/campaigns/${campaignID}/members`, { email, role })
        return resp.data
    } catch (error) {
        console.error("Falha ao adicionar membro a esta campanha: ", error)
        throw error;
    }
}

export async function Update(campaignID: string, name: string, description?: string): Promise<Campaign> {
    try {
        const resp = await apiClient.put(`/api/campaigns/${campaignID}`, { name, description })
        return resp.data
    } catch (error) {
        console.error("Falha ao atualizar campanha: ", error)
        throw error;
    }
}

export async function Delete(campaignID: string): Promise<MessageResponse> {
    try {
        const resp = await apiClient.delete(`/api/campaigns/${campaignID}`)
        return resp.data
    } catch (error) {
        console.error("Falha ao apagar campanha: ", error)
        throw error;
    }
}