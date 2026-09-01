import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { listResults } from "./api";
import { ResultTimeline } from "./result-timeline";
import { listRadars } from "@/features/radars/api";

vi.mock("./api", () => ({ listResults: vi.fn(), markResultRead: vi.fn(), markAllResultsRead: vi.fn() }));
vi.mock("@/features/radars/api", () => ({ listRadars: vi.fn() }));

describe("ResultTimeline", () => {
  it("shows source links and labels AI generated content", async () => {
    vi.mocked(listRadars).mockResolvedValue([]);
    vi.mocked(listResults).mockResolvedValue({ items: [{ id: "result-1", radar_id: "radar-1", scan_run_id: "run-1", title: "AI Agent 发布", url: "https://example.com/news", summary: "项目发布了新版本", relevance_reason: "符合产品发布标准", relevance_score: 91, is_relevant: true, is_read: false, created_at: "2026-09-01T03:00:00Z" }] });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><ResultTimeline /></QueryClientProvider>);
    expect(await screen.findByText("AI Agent 发布")).toBeInTheDocument();
    expect(screen.getByText("AI 摘要")).toBeInTheDocument();
    expect(screen.getByText("来源未提供")).toBeInTheDocument();
    expect(screen.getByText("发布时间未知")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "查看原文" })).toHaveAttribute("href", "https://example.com/news");
  });

  it("applies the unread filter", async () => {
    vi.mocked(listRadars).mockResolvedValue([]);
    vi.mocked(listResults)
      .mockResolvedValueOnce({ items: [] })
      .mockResolvedValueOnce({ items: [] });
    const actor = userEvent.setup();
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><ResultTimeline /></QueryClientProvider>);
    await screen.findByText("还没有命中结果");
    await actor.click(screen.getByLabelText("只看未读"));
    await screen.findByText("还没有命中结果");
    expect(vi.mocked(listResults)).toHaveBeenCalledWith(expect.objectContaining({ unread: true }));
  });

  it("loads the next cursor page", async () => {
    vi.mocked(listRadars).mockResolvedValue([]);
    const base = { radar_id: "radar-1", scan_run_id: "run-1", url: "https://example.com", summary: "摘要", relevance_reason: "理由", relevance_score: 90, is_relevant: true, is_read: true, created_at: "2026-09-01T03:00:00Z" };
    vi.mocked(listResults)
      .mockResolvedValueOnce({ items: [{ ...base, id: "result-1", title: "第一页" }], next_cursor: "cursor-2" })
      .mockResolvedValueOnce({ items: [{ ...base, id: "result-2", title: "第二页" }] });
    const actor = userEvent.setup();
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><ResultTimeline /></QueryClientProvider>);
    await actor.click(await screen.findByRole("button", { name: "加载更多" }));
    expect(await screen.findByText("第二页")).toBeInTheDocument();
    expect(vi.mocked(listResults)).toHaveBeenLastCalledWith(expect.objectContaining({ cursor: "cursor-2" }));
  });
});
