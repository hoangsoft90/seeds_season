/**
 * Unit test cho PlantProgress calcProgress (change garden-progress).
 *
 * Kiểm tra: progress calculation, stage detection, milestone badges, harvest readiness.
 */

import { describe, it, expect } from "vitest";
import { calcProgress } from "../components/PlantProgress";

const TIMELINE = {
  germination_days: [3, 7] as [number, number],
  days_to_harvest: [25, 35] as [number, number],
  growth_stages: [
    { stage: "germination", day_range: [0, 7] as [number, number] },
    { stage: "seedling", day_range: [7, 15] as [number, number] },
    { stage: "vegetative", day_range: [15, 30] as [number, number] },
    { stage: "harvest", day_range: [25, 35] as [number, number] },
  ],
};

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

describe("PlantProgress calcProgress", () => {
  it("shows 0% and germination stage for newly planted crop", () => {
    const info = calcProgress(daysAgo(0), TIMELINE);
    expect(info.progress).toBe(0);
    expect(info.currentStage).toBe("germination");
    expect(info.canHarvest).toBe(false);
  });

  it("shows correct stage for seedling phase (day 10)", () => {
    const info = calcProgress(daysAgo(10), TIMELINE);
    expect(info.currentStage).toBe("seedling");
    expect(info.currentStageLabel).toBe("Mầm non");
    expect(info.progress).toBeGreaterThan(0);
  });

  it("shows harvest stage when past day 25", () => {
    const info = calcProgress(daysAgo(28), TIMELINE);
    expect(info.currentStage).toBe("harvest");
    expect(info.canHarvest).toBe(true);
  });

  it("milestone at germination boundary (day 7)", () => {
    // Set planted to midnight 7 days ago → any time-of-day now gives daysPlanted >= 7
    const d = new Date();
    d.setDate(d.getDate() - 7);
    d.setHours(0, 0, 0, 0);
    const info = calcProgress(d.toISOString(), TIMELINE);
    expect(info.daysPlanted).toBeGreaterThanOrEqual(7);
    // Day >= 7 → seedling start → "🌱 Nảy mầm!" (germination just completed)
    expect(info.milestone).toBe("🌱 Nảy mầm!");
  });

  it("milestone at seedling boundary (day 15)", () => {
    const d = new Date();
    d.setDate(d.getDate() - 15);
    d.setHours(0, 0, 0, 0);
    const info = calcProgress(d.toISOString(), TIMELINE);
    expect(info.daysPlanted).toBeGreaterThanOrEqual(15);
    // Day >= 15 → vegetative start → "🌿 Lớn lên!" (seedling just completed)
    expect(info.milestone).toBe("🌿 Lớn lên!");
  });

  it("no milestone on regular days", () => {
    const info = calcProgress(daysAgo(3), TIMELINE);
    expect(info.milestone).toBeNull();
  });

  it("handles null timeline gracefully", () => {
    const info = calcProgress(daysAgo(10), null);
    expect(info.progress).toBe(0);
    expect(info.canHarvest).toBe(false);
    expect(info.currentStageLabel).toBe("Đang lớn");
  });

  it("progress caps at 100%", () => {
    const info = calcProgress(daysAgo(100), TIMELINE);
    expect(info.progress).toBe(100);
  });
});
