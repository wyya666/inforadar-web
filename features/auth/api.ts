import type { components } from "@/lib/api/generated/schema";
import { apiClient } from "@/lib/api/client";

export type User = components["schemas"]["User"];
export type RegisterInput = components["schemas"]["RegisterRequest"];
export type RegisterResult = components["schemas"]["RegisterResponse"];

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code = "request_failed",
    public readonly status = 0,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function toApiError(error: unknown, response: Response): ApiError {
  const payload = error as
    | { error?: { code?: string; message?: string } }
    | undefined;
  return new ApiError(
    payload?.error?.message ?? "请求失败，请稍后重试",
    payload?.error?.code,
    response.status,
  );
}

export async function registerAccount(
  input: RegisterInput,
): Promise<RegisterResult> {
  const { data, error, response } = await apiClient.POST("/auth/register", {
    body: input,
  });
  if (error || !data) throw toApiError(error, response);
  return data;
}

export async function verifyEmail(token: string): Promise<User> {
  const { data, error, response } = await apiClient.POST(
    "/auth/verify-email",
    { body: { token } },
  );
  if (error || !data) throw toApiError(error, response);
  return data.user;
}

export async function login(input: { email: string; password: string }): Promise<User> {
  const { data, error, response } = await apiClient.POST("/auth/login", { body: input });
  if (error || !data) throw toApiError(error, response);
  return data.user;
}

export async function getCurrentUser(): Promise<User> {
  const { data, error, response } = await apiClient.GET("/users/me");
  if (error || !data) throw toApiError(error, response);
  return data.user;
}

export async function logout(): Promise<void> {
  const { error, response } = await apiClient.POST("/auth/logout");
  if (error) throw toApiError(error, response);
}

export async function requestPasswordReset(email: string): Promise<void> {
  const { error, response } = await apiClient.POST("/auth/forgot-password", { body: { email } });
  if (error) throw toApiError(error, response);
}

export async function resetPassword(token: string, password: string): Promise<void> {
  const { error, response } = await apiClient.POST("/auth/reset-password", { body: { token, password } });
  if (error) throw toApiError(error, response);
}
