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
    await actor.type(screen.getByLabelText("密码"), "abc");
    await actor.click(screen.getByRole("button", { name: "创建账户" }));

    expect(await screen.findByText("密码至少需要 4 个字符")).toBeInTheDocument();
    expect(registerAccount).not.toHaveBeenCalled();
  });

  it("counts Unicode password length by characters", async () => {
    const actor = userEvent.setup();
    render(<RegistrationForm />);

    await actor.type(screen.getByLabelText("昵称"), "Radar User");
    await actor.type(screen.getByLabelText("邮箱"), "user@example.com");
    await actor.type(screen.getByLabelText("密码"), "🙂🙂🙂");
    await actor.click(screen.getByRole("button", { name: "创建账户" }));

    expect(await screen.findByText("密码至少需要 4 个字符")).toBeInTheDocument();
    expect(registerAccount).not.toHaveBeenCalled();
  });

  it("shows that the account can log in immediately after registration", async () => {
    vi.mocked(registerAccount).mockResolvedValue({
      user: {
        id: "user-1", email: "user@example.com", display_name: "Radar User",
        role: "user", status: "active", digest_enabled: true, search_credits: 100,
        credit_reset_at: "2026-10-01T00:00:00Z",
      },
      verification_required: false,
    });
    const actor = userEvent.setup();
    render(<RegistrationForm />);

    await actor.type(screen.getByLabelText("昵称"), "Radar User");
    await actor.type(screen.getByLabelText("邮箱"), "user@example.com");
    await actor.type(screen.getByLabelText("密码"), "1234");
    await actor.click(screen.getByRole("button", { name: "创建账户" }));

    expect(await screen.findByText("账户创建成功")).toBeInTheDocument();
    expect(screen.getByText("现在可以直接登录。", { exact: false })).toBeInTheDocument();
    expect(registerAccount).toHaveBeenCalledWith({
      display_name: "Radar User",
      email: "user@example.com",
      password: "1234",
    });
  });

  it("preserves the verification message for an older server response", async () => {
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
    await actor.type(screen.getByLabelText("密码"), "1234");
    await actor.click(screen.getByRole("button", { name: "创建账户" }));

    expect(await screen.findByText("验证邮件已发送")).toBeInTheDocument();
  });
});
