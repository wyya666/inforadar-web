import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getPlatformStatus, listAuditRecords } from "./api";
import { PlatformDashboard } from "./platform-dashboard";

vi.mock("./api", () => ({ getPlatformStatus: vi.fn(), listAuditRecords: vi.fn() }));

describe("PlatformDashboard", () => {
  it("shows circuit breaker credential health and audit records", async () => {
    vi.mocked(getPlatformStatus).mockResolvedValue({ search_budget: { used: 8100, reserved: 0, limit: 10000, warning: true, exhausted: false }, credential_status: { valid: 8, invalid: 1, insufficient_balance: 2 } });
    vi.mocked(listAuditRecords).mockResolvedValue([{ id: "audit-1", actor_id: "admin-1", action: "credits.adjusted", target_type: "user", target_id: "user-1", metadata: "{}", created_at: "2026-09-01T03:00:00Z" }]);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><PlatformDashboard /></QueryClientProvider>);
    expect(await screen.findByText("8 个有效")).toBeInTheDocument();
    expect(screen.queryByText("月度 Web Search")).not.toBeInTheDocument();
    expect(screen.getByText("credits.adjusted")).toBeInTheDocument();
  });
});
