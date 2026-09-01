import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getCurrentUser } from "@/features/auth/api";
import { updateProfile } from "./api";
import { ProfileSettings } from "./profile-settings";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));
vi.mock("@/features/auth/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/features/auth/api")>();
  return { ...actual, getCurrentUser: vi.fn(), logout: vi.fn() };
});
vi.mock("./api", () => ({ updateProfile: vi.fn(), deleteAccount: vi.fn(), changePassword: vi.fn() }));

describe("ProfileSettings", () => {
  beforeEach(() => {
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: "user-1", email: "user@example.com", display_name: "Old Name", role: "user",
      status: "active", digest_enabled: true, search_credits: 100,
      credit_reset_at: "2026-10-01T00:00:00Z",
    });
    vi.mocked(updateProfile).mockReset();
  });

  it("updates the profile and digest preference", async () => {
    vi.mocked(updateProfile).mockResolvedValue({
      id: "user-1", email: "user@example.com", display_name: "New Name", role: "user",
      status: "active", digest_enabled: false, search_credits: 100,
      credit_reset_at: "2026-10-01T00:00:00Z",
    });
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const actor = userEvent.setup();
    render(<QueryClientProvider client={queryClient}><ProfileSettings /></QueryClientProvider>);

    const name = await screen.findByLabelText("昵称");
    expect(screen.getByText("同一结果只汇总一次")).toBeInTheDocument();
    await actor.clear(name);
    await actor.type(name, "New Name");
    await actor.click(screen.getByLabelText("接收每日摘要"));
    await actor.click(screen.getByRole("button", { name: "保存资料" }));

    expect(vi.mocked(updateProfile).mock.calls[0]?.[0]).toEqual({ display_name: "New Name", digest_enabled: false });
    expect(await screen.findByText("资料已保存")).toBeInTheDocument();
  });
});
