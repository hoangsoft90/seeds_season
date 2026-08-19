/**
 * Unit test cho AI Explanation Provider (change ai-explanation).
 *
 * Kiểm tra: cache, fallback về template khi không có API key, fallback khi API fail.
 * Không test API thật (network-dependent) — test logic cache + fallback.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { buildWhyText } from "../lib/explanation";
import { buildWhyTextAI, clearExplanationCache } from "../lib/explanation/ai-provider";
import { getAllCrops } from "../lib/data/crops";
import type { ComponentScores } from "../lib/recommendation-engine/scoring";

const crops = getAllCrops();
const caiXanh = crops.find((c) => c.crop_base.id === "cai_xanh")!;

const SCORES: ComponentScores = {
  season: 90,
  temperature: 85,
  beginner: 100,
  fast_harvest: 80,
  sunspace: 70,
};

const TEMPLATE = "Cải xanh đang đúng thời vụ. Rất dễ trồng, phù hợp người mới.";

beforeEach(() => {
  clearExplanationCache();
  vi.restoreAllMocks();
  delete process.env.OPENAI_API_KEY;
});

describe("buildWhyTextAI", () => {
  it("falls back to template when no API key", async () => {
    const result = await buildWhyTextAI(
      {
        crop: caiXanh,
        components: SCORES,
        region: "north_vietnam",
        role: "easy",
        month: 8,
      },
      TEMPLATE,
    );
    expect(result).toBe(TEMPLATE);
  });

  it("falls back to template when API returns error", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }) as never;

    const result = await buildWhyTextAI(
      {
        crop: caiXanh,
        components: SCORES,
        region: "north_vietnam",
        role: "easy",
        month: 8,
      },
      TEMPLATE,
    );
    expect(result).toBe(TEMPLATE);
  });

  it("caches AI response for same crop+region+month", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    const aiText = "Cải xanh rất phù hợp tháng 8 ở Hà Nội!";
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: aiText } }] }),
    }) as never;

    const input = {
      crop: caiXanh,
      components: SCORES,
      region: "north_vietnam" as const,
      role: "easy" as const,
      month: 8,
    };

    const r1 = await buildWhyTextAI(input, TEMPLATE);
    const r2 = await buildWhyTextAI(input, TEMPLATE);

    expect(r1).toBe(aiText);
    expect(r2).toBe(aiText);
    // fetch called only once (second hit cache)
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("uses AI text when API succeeds", async () => {
    process.env.OPENAI_API_KEY = "test-key";
    const aiText = "Tháng 8 Hà Nội nóng 33°C — cải xanh chịu được nhưng cần tưới đều.";
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ choices: [{ message: { content: aiText } }] }),
    }) as never;

    const result = await buildWhyTextAI(
      {
        crop: caiXanh,
        components: SCORES,
        region: "north_vietnam",
        role: "easy",
        month: 8,
      },
      TEMPLATE,
    );
    expect(result).toBe(aiText);
  });
});

describe("buildWhyText template (unchanged)", () => {
  it("still works as before", () => {
    const text = buildWhyText(caiXanh, SCORES, "north_vietnam", "easy", { month: 8 });
    expect(text).toContain("thu hoạch");
    expect(text).toContain("dễ trồng");
  });
});
