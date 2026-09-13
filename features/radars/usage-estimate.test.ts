import { describe, expect, it } from "vitest";
import { estimateMonthlyScans } from "./usage-estimate";

describe("estimateMonthlyScans", () => {
  it("estimates a 30-day month without imposing a credit cap", () => {
    expect(estimateMonthlyScans(180)).toEqual({ scansPerDay: 8, scheduledPerMonth: 240 });
  });
});
