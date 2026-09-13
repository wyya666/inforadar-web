import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { listRadars, runRadarAction, updateRadar } from "./api";
import { RadarList } from "./radar-list";
import { getSearchSettings } from "@/features/settings/api";

vi.mock("@/features/settings/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/settings/api")>();
  return { ...actual, getSearchSettings: vi.fn() };
});

vi.mock("./api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./api")>();
  return { ...actual, listRadars: vi.fn(), runRadarAction: vi.fn(), updateRadar: vi.fn(), deleteRadar: vi.fn() };
});

describe("RadarList", () => {
  it("lists owned radars and pauses an active radar", async () => {
    vi.mocked(getSearchSettings).mockResolvedValue({ active_provider: "zhipu", credentials: { zhipu: { provider: "zhipu", masked_key: "••••1234", status: "valid", last_validated_at: "2026-09-01T03:00:00Z" }, tavily: null, baidu: null } });
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

  it("guides users and disables scan and resume without a valid search key", async () => {
    vi.mocked(getSearchSettings).mockResolvedValue({ active_provider: null, credentials: { zhipu: null, tavily: null, baidu: null } });
    vi.mocked(listRadars).mockResolvedValue([{ id: "radar-1", name: "AI", user_intent: "AI", search_query: "AI", relevance_criteria: "AI", interval_minutes: 60, relevance_threshold: 70, status: "paused", pause_reason: "search_credential", next_scan_at: "2026-09-01T04:00:00Z", created_at: "2026-09-01T03:00:00Z", updated_at: "2026-09-01T03:00:00Z" }]);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><RadarList /></QueryClientProvider>);
    expect(await screen.findByRole("button", { name: "立即扫描" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "恢复雷达" })).toBeDisabled();
    expect(screen.getByRole("heading", { name: "请先配置搜索服务" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "前往设置" })).toHaveAttribute("href", "/settings");
  });

  it("edits a radar plan and interval", async () => {
    vi.mocked(getSearchSettings).mockResolvedValue({ active_provider: "tavily", credentials: { zhipu: null, tavily: { provider: "tavily", masked_key: "••••5678", status: "valid", last_validated_at: "2026-09-01T03:00:00Z" }, baidu: null } });
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
