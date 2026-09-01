import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { listFailedScans } from "./api";
import { FailedScans } from "./failed-scans";

vi.mock("./api", () => ({ listFailedScans: vi.fn(), retryFailedScan: vi.fn() }));

describe("FailedScans", () => {
  it("shows failure code and retry action", async () => {
    vi.mocked(listFailedScans).mockResolvedValue([{ id: "run-1", radar_id: "radar-1", status: "failed", attempt: 3, search_count: 0, matched_count: 0, error_code: "search_failed", error_message: "provider unavailable", created_at: "2026-09-01T03:00:00Z", updated_at: "2026-09-01T03:01:00Z" }]);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><FailedScans /></QueryClientProvider>);
    expect(await screen.findByText("search_failed")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "重试" })).toBeInTheDocument();
  });
});
