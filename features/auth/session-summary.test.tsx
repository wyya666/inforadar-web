import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { getCurrentUser, logout } from "./api";
import { SessionSummary } from "./session-summary";

const push = vi.fn();
const refresh = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh }) }));
vi.mock("./api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./api")>();
  return { ...actual, getCurrentUser: vi.fn(), logout: vi.fn() };
});

describe("SessionSummary", () => {
  it("logs out and returns to the public page", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-1", email: "user@example.com", display_name: "Radar User", role: "user",
      status: "active", digest_enabled: true, search_credits: 100,
      credit_reset_at: "2026-10-01T00:00:00Z",
    });
    vi.mocked(logout).mockResolvedValue();
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const actor = userEvent.setup();
    render(<QueryClientProvider client={client}><SessionSummary /></QueryClientProvider>);

    expect(await screen.findByText("Radar User")).toBeInTheDocument();
    await actor.click(screen.getByRole("button", { name: "退出登录" }));

    expect(logout).toHaveBeenCalledOnce();
    expect(push).toHaveBeenCalledWith("/");
    expect(refresh).toHaveBeenCalledOnce();
  });
});
