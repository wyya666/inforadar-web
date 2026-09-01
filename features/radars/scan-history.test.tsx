import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { listScanRuns } from "./api";
import { ScanHistory } from "./scan-history";

vi.mock("./api", () => ({ listScanRuns: vi.fn() }));

describe("ScanHistory", () => {
  it("shows recent scan status after expansion", async () => {
    vi.mocked(listScanRuns).mockResolvedValue([{ id: "run-1", radar_id: "radar-1", status: "succeeded", attempt: 1, search_count: 10, matched_count: 2, created_at: "2026-09-01T03:00:00Z", updated_at: "2026-09-01T03:00:02Z" }]);
    const actor = userEvent.setup();
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><ScanHistory radarID="radar-1" /></QueryClientProvider>);
    await actor.click(screen.getByRole("button", { name: "查看扫描历史" }));
    expect(await screen.findByText("成功")).toBeInTheDocument();
    expect(screen.getByText("命中 2 / 10")).toBeInTheDocument();
  });
});
