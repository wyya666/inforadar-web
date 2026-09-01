import type { components } from "@/lib/api/generated/schema";
import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/features/auth/api";

export type RadarPlan = components["schemas"]["RadarPlan"];
export type Radar = components["schemas"]["Radar"];
export type ScanRun = components["schemas"]["ScanRun"];
export type ScanAttempt = components["schemas"]["ScanAttempt"];
export type UpdateRadarInput = {
  name: string;
  search_query: string;
  relevance_criteria: string;
  interval_minutes: 30 | 60 | 180 | 360 | 720 | 1440;
  relevance_threshold: number;
};

function radarError(error: unknown, response: Response) {
  const body = error as { error?: { code?: string; message?: string } } | undefined;
  return new ApiError(body?.error?.message ?? "雷达服务暂时不可用", body?.error?.code, response.status);
}

export async function generateRadarPlan(intent: string): Promise<RadarPlan> {
  const { data, error, response } = await apiClient.POST("/radar-plans", { body: { intent } });
  if (error || !data) throw radarError(error, response);
  return data.plan;
}

export async function createRadar(input: {
  name: string;
  user_intent: string;
  search_query: string;
  relevance_criteria: string;
  interval_minutes: 30 | 60 | 180 | 360 | 720 | 1440;
}): Promise<Radar> {
  const { data, error, response } = await apiClient.POST("/radars", { body: input });
  if (error || !data) throw radarError(error, response);
  return data.radar;
}

export async function listRadars(): Promise<Radar[]> {
  const { data, error, response } = await apiClient.GET("/radars");
  if (error || !data) throw radarError(error, response);
  return data.radars;
}

export async function updateRadar(id: string, input: UpdateRadarInput): Promise<Radar> {
  const { data, error, response } = await apiClient.PATCH("/radars/{radarID}", {
    params: { path: { radarID: id } },
    body: input,
  });
  if (error || !data) throw radarError(error, response);
  return data.radar;
}

export async function runRadarAction(id: string, action: "pause" | "resume" | "scan"): Promise<Radar> {
  const { data, error, response } = await apiClient.POST("/radars/{radarID}/{action}", {
    params: { path: { radarID: id, action } },
  });
  if (error || !data) throw radarError(error, response);
  return data.radar;
}

export async function deleteRadar(id: string): Promise<void> {
  const { error, response } = await apiClient.DELETE("/radars/{radarID}", { params: { path: { radarID: id } } });
  if (error) throw radarError(error, response);
}

export async function listScanRuns(radarID: string): Promise<ScanRun[]> {
  const { data, error, response } = await apiClient.GET("/radars/{radarID}/runs", {
    params: { path: { radarID }, query: { limit: 10 } },
  });
  if (error || !data) throw radarError(error, response);
  return data.runs;
}

export async function listScanAttempts(runID: string): Promise<ScanAttempt[]> {
  const { data, error, response } = await apiClient.GET("/scan-runs/{runID}/attempts", {
    params: { path: { runID } },
  });
  if (error || !data) throw radarError(error, response);
  return data.attempts;
}
