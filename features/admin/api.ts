import { ApiError } from "@/features/auth/api";
import { apiClient } from "@/lib/api/client";
import type { components } from "@/lib/api/generated/schema";

export type AdminUser = components["schemas"]["User"];
export type FailedScanRun = components["schemas"]["ScanRun"];
export type PlatformStatus = components["schemas"]["PlatformStatus"];
export type AuditRecord = components["schemas"]["AuditRecord"];

export async function listAdminUsers(): Promise<AdminUser[]> {
  const { data, error, response } = await apiClient.GET("/admin/users", { params: { query: { limit: 100 } } });
  if (error || !data) throw adminError(error, response);
  return data.users;
}

export async function setAdminUserStatus(userID: string, status: "active" | "suspended"): Promise<void> {
  const { error, response } = await apiClient.POST("/admin/users/{userID}/status", { params: { path: { userID } }, body: { status } });
  if (error) throw adminError(error, response);
}

export async function adjustAdminUserCredits(userID: string, delta: number): Promise<number> {
  const { data, error, response } = await apiClient.POST("/admin/users/{userID}/credits", { params: { path: { userID } }, body: { delta } });
  if (error || !data) throw adminError(error, response);
  return data.balance;
}

export async function listFailedScans(): Promise<FailedScanRun[]> {
  const { data, error, response } = await apiClient.GET("/admin/scan-runs/failed");
  if (error || !data) throw adminError(error, response);
  return data.runs;
}

export async function retryFailedScan(runID: string): Promise<void> {
  const { error, response } = await apiClient.POST("/admin/scan-runs/{runID}/retry", { params: { path: { runID } } });
  if (error) throw adminError(error, response);
}

export async function getPlatformStatus(): Promise<PlatformStatus> {
  const { data, error, response } = await apiClient.GET("/admin/platform");
  if (error || !data) throw adminError(error, response);
  return data;
}

export async function listAuditRecords(): Promise<AuditRecord[]> {
  const { data, error, response } = await apiClient.GET("/admin/audit");
  if (error || !data) throw adminError(error, response);
  return data.records;
}

function adminError(error: unknown, response: Response) {
  const body = error as { error?: { code?: string; message?: string } } | undefined;
  return new ApiError(body?.error?.message ?? "管理员服务暂时不可用", body?.error?.code, response.status);
}
