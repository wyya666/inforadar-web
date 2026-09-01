import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { listAdminUsers } from "./api";
import { UserManagement } from "./user-management";

vi.mock("./api", () => ({ listAdminUsers: vi.fn(), setAdminUserStatus: vi.fn(), adjustAdminUserCredits: vi.fn() }));

describe("UserManagement", () => {
  it("shows users with suspension and credit controls", async () => {
    vi.mocked(listAdminUsers).mockResolvedValue([{ id: "user-1", email: "user@example.com", display_name: "User", role: "user", status: "active", digest_enabled: true, search_credits: 100, credit_reset_at: "2026-10-01T00:00:00Z" }]);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><UserManagement /></QueryClientProvider>);
    expect(await screen.findByText("user@example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "封禁" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "调整额度" })).toBeInTheDocument();
  });
});
