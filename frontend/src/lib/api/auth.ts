import { MessageResponse } from "../types/GeneralTypes";
import { apiClient } from "./client";

export async function Login(email: string, password: string): Promise<MessageResponse> {
    try {
        const resp = await apiClient.post("/api/auth/login", { email, password })
        return resp.data
    } catch (error) {
        console.error("Falha ao fazer login: ", error)
        throw error;
    }
}

export async function Register(username: string, email: string, password: string): Promise<MessageResponse> {
    try {
        console.log(username, email, password)
        const resp = await apiClient.post("/api/auth/register", { username, email, password })
        return resp.data
    } catch (error) {
        console.error("Falha ao se registrar: ", error)
        throw error;
    }
}