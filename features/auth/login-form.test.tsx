import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { login } from "./api";
import { LoginForm } from "./login-form";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh: vi.fn() }) }));
vi.mock("./api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./api")>();
  return { ...actual, login: vi.fn() };
});

describe("LoginForm", () => {
  beforeEach(() => {
    push.mockReset();
    vi.mocked(login).mockReset();
  });

  it("logs in and opens the dashboard", async () => {
    vi.mocked(login).mockResolvedValue({
      id: "user-1", email: "user@example.com", display_name: "User", role: "user",
      status: "active", digest_enabled: true, search_credits: 100,
      credit_reset_at: "2026-10-01T00:00:00Z",
    });
    const actor = userEvent.setup();
    render(<LoginForm />);

    await actor.type(screen.getByLabelText("邮箱"), "user@example.com");
    await actor.type(screen.getByLabelText("密码"), "correct horse battery staple");
    await actor.click(screen.getByRole("button", { name: "登录" }));

    expect(login).toHaveBeenCalledWith({ email: "user@example.com", password: "correct horse battery staple" });
    expect(push).toHaveBeenCalledWith("/dashboard");
  });
});
