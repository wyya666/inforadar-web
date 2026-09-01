import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { listRadars, runRadarAction, updateRadar } from "./api";
import { RadarList } from "./radar-list";
import { getUsage } from "@/features/usage/api";

vi.mock("@/features/usage/api", () => ({ getUsage: vi.fn() }));

vi.mock("./api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./api")>();
  return { ...actual, listRadars: vi.fn(), runRadarAction: vi.fn(), updateRadar: vi.fn(), deleteRadar: vi.fn() };
});

describe("RadarList", () => {
  it("lists owned radars and pauses an active radar", async () => {
	vi.mocked(getUsage).mockResolvedValue({ remaining: 100, monthly_limit: 100, reset_at: "2026-10-01T00:00:00+08:00" });
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

  it("disables manual scans when credits are exhausted", async () => {
    vi.mocked(getUsage).mockResolvedValue({ remaining: 0, monthly_limit: 100, reset_at: "2026-10-01T00:00:00+08:00" });
    vi.mocked(listRadars).mockResolvedValue([{ id: "radar-1", name: "AI", user_intent: "AI", search_query: "AI", relevance_criteria: "AI", interval_minutes: 60, relevance_threshold: 70, status: "active", next_scan_at: "2026-09-01T04:00:00Z", created_at: "2026-09-01T03:00:00Z", updated_at: "2026-09-01T03:00:00Z" }]);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><RadarList /></QueryClientProvider>);
    expect(await screen.findByRole("button", { name: "立即扫描" })).toBeDisabled();
    expect(screen.getByText("本月搜索额度已用完，自动和手动扫描已暂停。")).toBeInTheDocument();
  });

  it("edits a radar plan and interval", async () => {
    vi.mocked(getUsage).mockResolvedValue({ remaining: 100, monthly_limit: 100, reset_at: "2026-10-01T00:00:00+08:00" });
    const value = { id: "radar-1", name: "AI", user_intent: "AI", search_query: "AI", relevance_criteria: "AI 发布", interval_minutes: 60, relevance_threshold: 70, status: "active" as const, next_scan_at: "2026-09-01T04:00:00Z", created_at: "2026-09-01T03:00:00Z", updated_at: "2026-09-01T03:00:00Z" };
    vi.mocked(listRadars).mockResolvedValue([value]);
    vi.mocked(updateRadar).mockResolvedValue({ ...value, name: "Agent 发布", interval_minutes: 180 });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const actor = userEvent.setup();
    render(<QueryClientProvider client={client}><RadarList /></QueryClientProvider>);

    await actor.click(await screen.findByRole("button", { name: "编辑雷达" }));
    const name = screen.getByLabelText("雷达名称");
    await actor.clear(name);
    await actor.type(name, "Agent 发布");
    await actor.selectOptions(screen.getByLabelText("扫描频率"), "180");
    await actor.click(screen.getByRole("button", { name: "保存雷达" }));

    expect(vi.mocked(updateRadar)).toHaveBeenCalledWith("radar-1", expect.objectContaining({ name: "Agent 发布", interval_minutes: 180 }));
    expect(await screen.findByRole("heading", { name: "Agent 发布" })).toBeInTheDocument();
  });
});
