import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getUsage } from "./api";
import { UsageIndicator } from "./usage-indicator";

vi.mock("./api", () => ({ getUsage: vi.fn() }));

describe("UsageIndicator", () => {
  it("shows the monthly remaining credits", async () => {
    vi.mocked(getUsage).mockResolvedValue({ remaining: 73, monthly_limit: 100, reset_at: "2026-10-01T00:00:00+08:00" });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><UsageIndicator /></QueryClientProvider>);
    expect(await screen.findByText("73 / 100")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "73");
  });
});
