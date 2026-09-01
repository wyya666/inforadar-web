import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getUsage } from "@/features/usage/api";
import { RadarCreationFlow } from "./radar-creation-flow";

vi.mock("@/features/usage/api", () => ({ getUsage: vi.fn() }));

describe("RadarCreationFlow quota state", () => {
  it("blocks new radars when monthly credits are exhausted", async () => {
    vi.mocked(getUsage).mockResolvedValue({ remaining: 0, monthly_limit: 100, reset_at: "2026-10-01T00:00:00+08:00" });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><RadarCreationFlow /></QueryClientProvider>);
    expect(await screen.findByText("本月搜索额度已用完")).toBeInTheDocument();
    expect(screen.queryByLabelText("你想长期关注什么？")).not.toBeInTheDocument();
  });
});
