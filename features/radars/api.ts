import type { components } from "@/lib/api/generated/schema";
import { apiClient } from "@/lib/api/client";
import { ApiError } from "@/features/auth/api";

export type RadarPlan = components["schemas"]["RadarPlan"];
export type Radar = components["schemas"]["Radar"];

function radarError(error: unknown, response: Response) {
  const body = error as { error?: { code?: string; message?: string } } | undefined;
  return new ApiError(body?.error?.message ?? "雷达服务暂时不可用", body?.error?.code, response.status);
}

export async function generateRadarPlan(intent: string): Promise<RadarPlan> {
  const { data, error, response } = await apiClient.POST("/radar-plans", { body: { intent } });
  if (error || !data) throw radarError(error, response);
  return data.plan;
}
