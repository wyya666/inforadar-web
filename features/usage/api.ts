import { ApiError } from "@/features/auth/api";
import { apiClient } from "@/lib/api/client";
import type { components } from "@/lib/api/generated/schema";

export type Usage = components["schemas"]["Usage"];

export async function getUsage(): Promise<Usage> {
  const { data, error, response } = await apiClient.GET("/usage");
  if (error || !data) {
    const body = error as { error?: { code?: string; message?: string } } | undefined;
    throw new ApiError(body?.error?.message ?? "额度暂时不可用", body?.error?.code, response.status);
  }
  return data.usage;
}
