import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { registerAccount } from "./api";
import { RegistrationForm } from "./registration-form";

vi.mock("./api", () => ({ registerAccount: vi.fn() }));

describe("RegistrationForm", () => {
  beforeEach(() => vi.mocked(registerAccount).mockReset());

  it("validates the password before sending a request", async () => {
    const actor = userEvent.setup();
    render(<RegistrationForm />);

    await actor.type(screen.getByLabelText("昵称"), "Radar User");
    await actor.type(screen.getByLabelText("邮箱"), "user@example.com");
    await actor.type(screen.getByLabelText("密码"), "short");
    await actor.click(screen.getByRole("button", { name: "创建账户" }));

    expect(await screen.findByText("密码至少需要 12 个字符")).toBeInTheDocument();
    expect(registerAccount).not.toHaveBeenCalled();
  });

  it("shows the verification next step after registration", async () => {
    vi.mocked(registerAccount).mockResolvedValue({
      user: {
        id: "user-1", email: "user@example.com", display_name: "Radar User",
        role: "user", status: "active", digest_enabled: true, search_credits: 100,
        credit_reset_at: "2026-10-01T00:00:00Z",
      },
      verification_required: true,
    });
    const actor = userEvent.setup();
    render(<RegistrationForm />);

    await actor.type(screen.getByLabelText("昵称"), "Radar User");
    await actor.type(screen.getByLabelText("邮箱"), "user@example.com");
    await actor.type(screen.getByLabelText("密码"), "correct horse battery staple");
    await actor.click(screen.getByRole("button", { name: "创建账户" }));

    expect(await screen.findByText("验证邮件已发送")).toBeInTheDocument();
    expect(registerAccount).toHaveBeenCalledWith({
      display_name: "Radar User",
      email: "user@example.com",
      password: "correct horse battery staple",
    });
  });
});
