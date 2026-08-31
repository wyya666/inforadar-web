import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { generateRadarPlan } from "./api";
import { RadarIntentForm } from "./radar-intent-form";

vi.mock("./api", () => ({ generateRadarPlan: vi.fn() }));

describe("RadarIntentForm", () => {
  it("turns a natural-language intent into a plan", async () => {
    vi.mocked(generateRadarPlan).mockResolvedValue({ name: "AI Agent", search_query: "AI Agent 发布", relevance_criteria: "只关注正式发布" });
    const onPlan = vi.fn();
    const actor = userEvent.setup();
    render(<RadarIntentForm onPlan={onPlan} />);

    await actor.type(screen.getByLabelText("你想长期关注什么？"), "关注 AI Agent 产品的重要发布");
    await actor.click(screen.getByRole("button", { name: "生成雷达方案" }));

    expect(generateRadarPlan).toHaveBeenCalledWith("关注 AI Agent 产品的重要发布");
    expect(onPlan).toHaveBeenCalledWith("关注 AI Agent 产品的重要发布", expect.objectContaining({ name: "AI Agent" }));
  });
});
