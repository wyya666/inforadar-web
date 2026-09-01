import { ApiError } from "@/features/auth/api";
import { apiClient } from "@/lib/api/client";
import type { components } from "@/lib/api/generated/schema";

export type RadarResult = components["schemas"]["Result"];
export type ResultPage = { items: RadarResult[]; next_cursor?: string };

export async function listResults(input: { radarID?: string; unread?: boolean; cursor?: string } = {}): Promise<ResultPage> {
  const { data, error, response } = await apiClient.GET("/results", {
    params: { query: { radar_id: input.radarID, unread: input.unread, cursor: input.cursor, limit: 20 } },
  });
  if (error || !data) throw resultError(error, response);
  return data;
}

export async function markResultRead(resultID: string): Promise<void> {
  const { error, response } = await apiClient.POST("/results/{resultID}/read", { params: { path: { resultID } } });
  if (error) throw resultError(error, response);
}

export async function markAllResultsRead(): Promise<number> {
  const { data, error, response } = await apiClient.POST("/results/read-all");
  if (error || !data) throw resultError(error, response);
  return data.updated;
}

export async function getResultSummary(): Promise<number> {
  const { data, error, response } = await apiClient.GET("/results/summary");
  if (error || !data) throw resultError(error, response);
  return data.unread;
}

function resultError(error: unknown, response: Response) {
  const body = error as { error?: { code?: string; message?: string } } | undefined;
  return new ApiError(body?.error?.message ?? "结果服务暂时不可用", body?.error?.code, response.status);
}
