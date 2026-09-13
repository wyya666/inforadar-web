import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { listRadars } from "@/features/radars/api";
import { getResultSummary } from "@/features/results/api";
import { DashboardOverview } from "./overview";

vi.mock("@/features/radars/api", () => ({ listRadars: vi.fn() }));
vi.mock("@/features/results/api", () => ({ getResultSummary: vi.fn() }));

describe("DashboardOverview", () => {
  it("shows live radar and result counts without a platform quota card", async () => {
    vi.mocked(listRadars).mockResolvedValue([{ id: "radar-1", name: "AI", user_intent: "AI", search_query: "AI", relevance_criteria: "AI", interval_minutes: 60, relevance_threshold: 70, status: "active", next_scan_at: "2026-09-01T04:00:00Z", created_at: "2026-09-01T03:00:00Z", updated_at: "2026-09-01T03:00:00Z" }]);
    vi.mocked(getResultSummary).mockResolvedValue(7);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><DashboardOverview /></QueryClientProvider>);
    expect(await screen.findByText("1 / 3")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.queryByText("本月搜索额度")).not.toBeInTheDocument();
  });
});
