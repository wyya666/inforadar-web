import { describe, expect, it } from "vitest";
import { estimateMonthlyScans } from "./usage-estimate";

describe("estimateMonthlyScans", () => {
  it("estimates a 30-day month and caps consumed credits", () => {
    expect(estimateMonthlyScans(180, 100)).toEqual({ scansPerDay: 8, scheduledPerMonth: 240, usableCredits: 100 });
  });
});
