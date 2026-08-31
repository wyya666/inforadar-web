import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getDeepSeekCredential, setDeepSeekCredential } from "./api";
import { DeepSeekSettings } from "./deepseek-settings";

vi.mock("./api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./api")>();
  return { ...actual, getDeepSeekCredential: vi.fn(), setDeepSeekCredential: vi.fn(), deleteDeepSeekCredential: vi.fn() };
});

describe("DeepSeekSettings", () => {
  beforeEach(() => {
    vi.mocked(getDeepSeekCredential).mockResolvedValue(null);
    vi.mocked(setDeepSeekCredential).mockReset();
  });

  it("clears the full key and shows only metadata after validation", async () => {
    vi.mocked(setDeepSeekCredential).mockResolvedValue({
      provider: "deepseek", masked_key: "••••cret", status: "valid",
      currency: "CNY", total_balance: "12.50", last_validated_at: "2026-09-01T03:00:00Z",
    });
    const actor = userEvent.setup();
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={queryClient}><DeepSeekSettings /></QueryClientProvider>);

    const keyInput = await screen.findByLabelText("DeepSeek API Key");
    await actor.type(keyInput, "sk-sensitive-secret");
    await actor.click(screen.getByRole("button", { name: "验证并保存" }));

    expect(vi.mocked(setDeepSeekCredential).mock.calls[0]?.[0]).toBe("sk-sensitive-secret");
    expect(await screen.findByText("••••cret")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("sk-sensitive-secret")).not.toBeInTheDocument();
  });
});
