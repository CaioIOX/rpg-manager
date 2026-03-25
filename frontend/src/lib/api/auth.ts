import { MessageResponse } from "../types/GeneralTypes";
import { User } from "../types/User";
import { apiClient } from "./client";

export async function Login(
  email: string,
  password: string,
): Promise<MessageResponse> {
  try {
    const resp = await apiClient.post("/api/auth/login", { email, password });
    return resp.data;
  } catch (error) {
    console.error("Falha ao fazer login: ", error);
    throw error;
  }
}

export async function GoogleAuth(credential: string): Promise<MessageResponse> {
  try {
    const resp = await apiClient.post("/api/auth/google", { credential });
    return resp.data;
  } catch (error) {
    console.error("Falha ao se autenticar com o Google: ", error);
    throw error;
  }
}

export async function Register(
  username: string,
  email: string,
  password: string,
): Promise<MessageResponse> {
  try {
    const resp = await apiClient.post("/api/auth/register", {
      username,
      email,
      password,
    });
    return resp.data;
  } catch (error) {
    console.error("Falha ao se registrar: ", error);
    throw error;
  }
}

export async function GetCurrentUser(): Promise<User> {
  try {
    const resp = await apiClient.get("/api/me");
    return resp.data;
  } catch (error) {
    console.error("Falha ao recuperar dados do usuário", error);
    throw error;
  }
}

export async function Logout(): Promise<MessageResponse> {
  try {
    const resp = await apiClient.post("/api/logout");
    return resp.data;
  } catch (error) {
    console.error("Falha ao fazer logout: ", error);
    throw error;
  }
}
