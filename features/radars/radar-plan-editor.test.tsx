import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createRadar } from "./api";
import { RadarPlanEditor } from "./radar-plan-editor";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh: vi.fn() }) }));
vi.mock("./api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./api")>();
  return { ...actual, createRadar: vi.fn() };
});

describe("RadarPlanEditor", () => {
  it("lets the user confirm and create an editable AI plan", async () => {
    vi.mocked(createRadar).mockResolvedValue({
      id: "radar-1", name: "AI Agent", user_intent: "关注 AI", search_query: "AI Agent 发布",
      relevance_criteria: "正式发布", interval_minutes: 60, relevance_threshold: 70,
      status: "active", next_scan_at: "2026-09-01T03:00:00Z", created_at: "2026-09-01T03:00:00Z", updated_at: "2026-09-01T03:00:00Z",
    });
    const actor = userEvent.setup();
    render(<RadarPlanEditor intent="关注 AI" plan={{ name: "AI Agent", search_query: "AI Agent 发布", relevance_criteria: "正式发布" }} onBack={vi.fn()} />);

    await actor.clear(screen.getByLabelText("雷达名称"));
    await actor.type(screen.getByLabelText("雷达名称"), "Agent 新进展");
    await actor.selectOptions(screen.getByLabelText("扫描频率"), "60");
    await actor.click(screen.getByRole("button", { name: "确认并创建雷达" }));

    expect(vi.mocked(createRadar).mock.calls[0]?.[0]).toEqual(expect.objectContaining({ name: "Agent 新进展", interval_minutes: 60 }));
    expect(push).toHaveBeenCalledWith("/radars");
  });
});
