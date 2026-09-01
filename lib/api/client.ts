import createClient, { type Middleware } from "openapi-fetch";

import type { paths } from "./generated/schema";

const browserOrigin =
  typeof window === "undefined" ? "http://localhost:8080" : window.location.origin;
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? new URL("/api/v1", browserOrigin).toString();

const publicAuthPaths = new Set([
  "/auth/register",
  "/auth/verify-email",
  "/auth/login",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
]);

let refreshPromise: Promise<boolean> | undefined;
const retryRequests = new Map<string, Request>();

export function getCsrfToken(): string | undefined {
  if (typeof document === "undefined") return undefined;

  const prefix = "inforadar_csrf=";
  const value = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(prefix))
    ?.slice(prefix.length);

  return value ? decodeURIComponent(value) : undefined;
}

function withCsrfHeader(request: Request): Request {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return request;

  const headers = new Headers(request.headers);
  const csrfToken = getCsrfToken();
  if (csrfToken) headers.set("X-CSRF-Token", csrfToken);
  return new Request(request, { headers });
}

async function refreshSession(): Promise<boolean> {
  const headers = new Headers();
  const csrfToken = getCsrfToken();
  if (csrfToken) headers.set("X-CSRF-Token", csrfToken);

  const response = await globalThis.fetch(
    new Request(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers,
    }),
  );
  return response.ok;
}

const sessionMiddleware: Middleware = {
  onRequest({ request, id }) {
    const protectedRequest = withCsrfHeader(request);
    retryRequests.set(id, protectedRequest.clone());
    return protectedRequest;
  },
  async onResponse({ response, schemaPath, id }) {
    const retryRequest = retryRequests.get(id);
    retryRequests.delete(id);
    if (
      response.status !== 401 ||
      publicAuthPaths.has(schemaPath) ||
      !retryRequest
    ) {
      return response;
    }

    refreshPromise ??= refreshSession().finally(() => {
      refreshPromise = undefined;
    });
    if (!(await refreshPromise)) return response;
    return globalThis.fetch(withCsrfHeader(retryRequest));
  },
  onError({ id, error }) {
    retryRequests.delete(id);
    return error instanceof Error ? error : new Error("API request failed");
  },
};

export const apiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
  credentials: "include",
  fetch: (request) => globalThis.fetch(request),
});

apiClient.use(sessionMiddleware);
