import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient, getCsrfToken } from "./client";

describe("API client", () => {
  beforeEach(() => {
    document.cookie = "inforadar_csrf=csrf-token; path=/";
    vi.restoreAllMocks();
  });

  it("adds the CSRF token to unsafe requests", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(null, { status: 204 }),
    );

    await apiClient.POST("/auth/logout");

    const request = fetchMock.mock.calls[0]?.[0] as Request;
    expect(request.credentials).toBe("include");
    expect(request.url).toBe("http://localhost:3000/api/v1/auth/logout");
    expect(request.headers.get("X-CSRF-Token")).toBe("csrf-token");
  });

  it("rotates cookies once and retries an unauthorized request", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: { code: "invalid_token", message: "expired" } }), { status: 401, headers: { "Content-Type": "application/json" } }))
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ user: { id: "user-1" } }), { status: 200, headers: { "Content-Type": "application/json" } }));

    const result = await apiClient.GET("/users/me");

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect((fetchMock.mock.calls[1]?.[0] as Request).url).toContain("/auth/refresh");
    expect(result.response.status).toBe(200);
  });

  it("reads URL-encoded CSRF cookie values", () => {
    document.cookie = "inforadar_csrf=a%20b; path=/";
    expect(getCsrfToken()).toBe("a b");
  });
});
