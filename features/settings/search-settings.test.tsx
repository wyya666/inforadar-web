import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { deleteSearchCredential, getSearchSettings, selectSearchProvider, setSearchCredential } from "./api";
import { searchSettingsKey, SearchSettings } from "./search-settings";
import type { SearchSettings as SearchSettingsValue } from "./api";

vi.mock("./api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./api")>();
  return { ...actual, getSearchSettings: vi.fn(), setSearchCredential: vi.fn(), deleteSearchCredential: vi.fn(), selectSearchProvider: vi.fn() };
});

const zhipu = { provider: "zhipu" as const, masked_key: "••••1234", status: "valid" as const, last_validated_at: "2026-09-01T03:00:00Z" };
const tavily = { provider: "tavily" as const, masked_key: "••••5678", status: "valid" as const, last_validated_at: "2026-09-02T03:00:00Z" };

function renderSettings(initial: SearchSettingsValue = { active_provider: null, credentials: { zhipu: null, tavily: null } }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity }, mutations: { retry: false } } });
  client.setQueryData(searchSettingsKey, initial);
  render(<QueryClientProvider client={client}><SearchSettings /></QueryClientProvider>);
}

describe("SearchSettings", () => {
  beforeEach(() => {
    vi.mocked(getSearchSettings).mockResolvedValue({ active_provider: null, credentials: { zhipu: null, tavily: null } });
    vi.mocked(setSearchCredential).mockReset();
    vi.mocked(deleteSearchCredential).mockReset();
    vi.mocked(selectSearchProvider).mockReset();
  });

  it("shows both providers and clears the key after validated save", async () => {
    vi.mocked(setSearchCredential).mockResolvedValue({ active_provider: "zhipu", credentials: { zhipu, tavily: null } });
    const actor = userEvent.setup();
    renderSettings();

    expect(await screen.findByRole("heading", { name: "智谱搜索" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tavily" })).toBeInTheDocument();
    const input = screen.getByLabelText("智谱搜索 API Key");
    await actor.type(input, "sensitive-zhipu-key");
    await actor.click(screen.getAllByRole("button", { name: "验证并保存" })[0]);

    expect(setSearchCredential).toHaveBeenCalledWith("zhipu", "sensitive-zhipu-key");
    expect(await screen.findByText("••••1234")).toBeInTheDocument();
    expect(screen.getByText("当前平台")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("sensitive-zhipu-key")).not.toBeInTheDocument();
  });

  it("switches providers and deletes a stored key", async () => {
    vi.mocked(getSearchSettings).mockResolvedValue({ active_provider: "zhipu", credentials: { zhipu, tavily } });
    vi.mocked(selectSearchProvider).mockResolvedValue({ active_provider: "tavily", credentials: { zhipu, tavily } });
    vi.mocked(deleteSearchCredential).mockResolvedValue({ active_provider: null, credentials: { zhipu, tavily: null } });
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const actor = userEvent.setup();
    renderSettings({ active_provider: "zhipu", credentials: { zhipu, tavily } });

    const tavilyCard = (await screen.findByRole("heading", { name: "Tavily" })).closest("article");
    expect(tavilyCard).not.toBeNull();
    await actor.click(within(tavilyCard!).getByRole("button", { name: "设为当前平台" }));
    expect(vi.mocked(selectSearchProvider).mock.calls[0]?.[0]).toBe("tavily");
    await actor.click(within(tavilyCard!).getByRole("button", { name: "删除 Tavily Key" }));
    expect(vi.mocked(deleteSearchCredential).mock.calls[0]?.[0]).toBe("tavily");
  });
});
