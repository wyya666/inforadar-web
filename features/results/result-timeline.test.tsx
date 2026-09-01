import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { listResults } from "./api";
import { ResultTimeline } from "./result-timeline";

vi.mock("./api", () => ({ listResults: vi.fn(), markResultRead: vi.fn(), markAllResultsRead: vi.fn() }));

describe("ResultTimeline", () => {
  it("shows source links and labels AI generated content", async () => {
    vi.mocked(listResults).mockResolvedValue({ items: [{ id: "result-1", radar_id: "radar-1", scan_run_id: "run-1", title: "AI Agent 发布", url: "https://example.com/news", summary: "项目发布了新版本", relevance_reason: "符合产品发布标准", relevance_score: 91, is_relevant: true, is_read: false, created_at: "2026-09-01T03:00:00Z" }] });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><ResultTimeline /></QueryClientProvider>);
    expect(await screen.findByText("AI Agent 发布")).toBeInTheDocument();
    expect(screen.getByText("AI 摘要")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "查看原文" })).toHaveAttribute("href", "https://example.com/news");
  });
});
