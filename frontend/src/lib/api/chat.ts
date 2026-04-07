import { apiClient } from "./client";

export interface ChatMessage {
  id: string; // gerado localmente para key do React
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface ChatUsage {
  messages_used: number;
  messages_limit: number; // -1 = ilimitado (premium)
}

interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

interface SendMessagePayload {
  message: string;
  history: ChatHistoryItem[];
}

interface ChatApiResponse {
  content: string;
}

interface RateLimitResponse {
  error: string;
  messages_used: number;
  messages_limit: number;
}

export class LorenaRateLimitError extends Error {
  public readonly messagesUsed: number;
  public readonly messagesLimit: number;

  constructor(data: RateLimitResponse) {
    super(data.error);
    this.messagesUsed = data.messages_used;
    this.messagesLimit = data.messages_limit;
  }
}

export async function SendMessage(
  campaignID: string,
  message: string,
  history: ChatHistoryItem[],
): Promise<ChatApiResponse> {
  try {
    const payload: SendMessagePayload = { message, history };
    const resp = await apiClient.post(
      `/api/campaigns/${campaignID}/chat`,
      payload,
    );
    return resp.data;
  } catch (err: unknown) {
    const axiosErr = err as { response?: { status?: number; data?: RateLimitResponse } };
    if (axiosErr?.response?.status === 429 && axiosErr.response.data) {
      throw new LorenaRateLimitError(axiosErr.response.data);
    }
    throw err;
  }
}

export async function GetUsage(campaignID: string): Promise<ChatUsage> {
  const resp = await apiClient.get(
    `/api/campaigns/${campaignID}/chat/usage`,
  );
  return resp.data;
}
