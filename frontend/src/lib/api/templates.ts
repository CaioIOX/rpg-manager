
import { MessageResponse } from "../types/GeneralTypes"
import { Template } from "../types/Template"
import { apiClient } from "./client"

export async function List(campaignID: string): Promise<Template[]> {
    try {
    
        const resp = await apiClient.get(`/api/campaigns/${campaignID}/templates`)
        return resp.data
    } catch (error) {
        console.error("Falha ao listar templates: ", error)
        throw error;
    }
}

export async function GetByID(campaignID: string, templateID: string): Promise<Template> {
    try {
        const resp = await apiClient.get(`/api/campaigns/${campaignID}/templates/${templateID}`)
        return resp.data
    } catch (error) {
        console.error("Falha ao recuperar informações do template: ", error)
        throw error;
    }
}

export async function Create(campaignID: string, name: string, schema: Record<string, unknown>, defaultContent?: Record<string, unknown>, description?: string, icon?: string): Promise<MessageResponse> {
    try {
        const resp = await apiClient.post(`/api/campaigns/${campaignID}/templates`, { name, schema, defaultContent, description, icon })
        return resp.data
    } catch (error) {
        console.error("Falha ao criar a template: ", error)
        throw error;
    }
}

export async function Update(campaignID: string, templateID: string, name?: string, schema?: Record<string, unknown>, defaultContent?: Record<string, unknown>, description?: string, icon?: string): Promise<Template> {
    try {
        const resp = await apiClient.put(`/api/campaigns/${campaignID}/templates/${templateID}`, { name, schema, defaultContent, description, icon })
        return resp.data
    } catch (error) {
        console.error("Falha ao atualizar template: ", error)
        throw error;
    }
}

export async function Delete(campaignID: string, templateID: string): Promise<MessageResponse> {
    try {
        const resp = await apiClient.delete(`/api/campaigns/${campaignID}/templates/${templateID}`)
        return resp.data
    } catch (error) {
        console.error("Falha ao apagar template: ", error)
        throw error;
    }
}