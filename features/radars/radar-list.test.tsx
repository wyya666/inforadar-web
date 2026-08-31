import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { listRadars, runRadarAction } from "./api";
import { RadarList } from "./radar-list";

vi.mock("./api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./api")>();
  return { ...actual, listRadars: vi.fn(), runRadarAction: vi.fn(), deleteRadar: vi.fn() };
});

describe("RadarList", () => {
  it("lists owned radars and pauses an active radar", async () => {
    const value = {
      id: "radar-1", name: "AI Agent", user_intent: "关注 AI", search_query: "AI Agent 发布", relevance_criteria: "正式发布",
      interval_minutes: 60, relevance_threshold: 70, status: "active" as const,
      next_scan_at: "2026-09-01T04:00:00Z", created_at: "2026-09-01T03:00:00Z", updated_at: "2026-09-01T03:00:00Z",
    };
    vi.mocked(listRadars).mockResolvedValue([value]);
    vi.mocked(runRadarAction).mockResolvedValue({ ...value, status: "paused" });
    const actor = userEvent.setup();
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><RadarList /></QueryClientProvider>);

    expect(await screen.findByText("AI Agent")).toBeInTheDocument();
    await actor.click(screen.getByRole("button", { name: "暂停雷达" }));
    expect(vi.mocked(runRadarAction).mock.calls[0]?.slice(0, 2)).toEqual(["radar-1", "pause"]);
    expect(await screen.findByText("已暂停")).toBeInTheDocument();
  });
});
