import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { requestPasswordReset, resetPassword } from "./api";
import { ForgotPasswordForm, ResetPasswordForm } from "./password-recovery";

vi.mock("./api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./api")>();
  return { ...actual, requestPasswordReset: vi.fn(), resetPassword: vi.fn() };
});

describe("password recovery", () => {
  beforeEach(() => {
    vi.mocked(requestPasswordReset).mockReset();
    vi.mocked(resetPassword).mockReset();
  });

  it("shows the same accepted state for a reset request", async () => {
    vi.mocked(requestPasswordReset).mockResolvedValue();
    const actor = userEvent.setup();
    render(<ForgotPasswordForm />);
    await actor.type(screen.getByLabelText("邮箱"), "user@example.com");
    await actor.click(screen.getByRole("button", { name: "发送重置邮件" }));
    expect(await screen.findByText("如果账户存在，邮件已经发出")).toBeInTheDocument();
  });

  it("resets a password from the emailed token", async () => {
    vi.mocked(resetPassword).mockResolvedValue();
    const actor = userEvent.setup();
    render(<ResetPasswordForm token="reset-token" />);
    await actor.type(screen.getByLabelText("新密码"), "5678");
    await actor.click(screen.getByRole("button", { name: "更新密码" }));
    expect(resetPassword).toHaveBeenCalledWith("reset-token", "5678");
    expect(await screen.findByText("密码已更新")).toBeInTheDocument();
  });

  it("rejects a three-character replacement password", async () => {
    const actor = userEvent.setup();
    render(<ResetPasswordForm token="reset-token" />);
    await actor.type(screen.getByLabelText("新密码"), "abc");
    await actor.click(screen.getByRole("button", { name: "更新密码" }));
    expect(await screen.findByText("密码至少需要 4 个字符")).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it("counts Unicode replacement-password length by characters", async () => {
    const actor = userEvent.setup();
    render(<ResetPasswordForm token="reset-token" />);
    await actor.type(screen.getByLabelText("新密码"), "🙂🙂🙂");
    await actor.click(screen.getByRole("button", { name: "更新密码" }));
    expect(await screen.findByText("密码至少需要 4 个字符")).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });
});
