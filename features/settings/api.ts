import type { components } from "@/lib/api/generated/schema";
import { apiClient } from "@/lib/api/client";
import { ApiError, type User } from "@/features/auth/api";

function apiError(error: unknown, response: Response): ApiError {
  const body = error as { error?: { code?: string; message?: string } } | undefined;
  return new ApiError(body?.error?.message ?? "请求失败，请稍后重试", body?.error?.code, response.status);
}

export async function updateProfile(input: { display_name: string; digest_enabled: boolean }): Promise<User> {
  const { data, error, response } = await apiClient.PATCH("/users/me", { body: input });
  if (error || !data) throw apiError(error, response);
  return data.user;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const { error, response } = await apiClient.POST("/auth/change-password", {
    body: { current_password: currentPassword, new_password: newPassword },
  });
  if (error) throw apiError(error, response);
}

export async function deleteAccount(): Promise<void> {
  const { error, response } = await apiClient.DELETE("/users/me");
  if (error) throw apiError(error, response);
}

export type CredentialMetadata = components["schemas"]["CredentialMetadata"];

export async function getDeepSeekCredential(): Promise<CredentialMetadata | null> {
  const { data, error, response } = await apiClient.GET("/credentials/deepseek");
  if (response.status === 404) return null;
  if (error || !data) throw apiError(error, response);
  return data.credential;
}

export async function setDeepSeekCredential(apiKey: string): Promise<CredentialMetadata> {
  const { data, error, response } = await apiClient.PUT("/credentials/deepseek", { body: { api_key: apiKey } });
  if (error || !data) throw apiError(error, response);
  return data.credential;
}

export async function deleteDeepSeekCredential(): Promise<void> {
  const { error, response } = await apiClient.DELETE("/credentials/deepseek");
  if (error) throw apiError(error, response);
}
