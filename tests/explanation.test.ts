/**
 * Unit test cho nudge theo lịch sử thất bại trong explanation (change my-garden,
 * data moat). Kiểm tra buildWhyText thêm câu "Lần trước..." đúng điều kiện —
 * KHÔNG đụng tới điểm số engine (Golden Tests 21/21 giữ nguyên).
 */

import { describe, it, expect } from "vitest";
import { buildWhyText } from "../lib/explanation";
import { getCropById } from "../lib/data/crops";
import vi from "../lib/i18n/vi.json";

// Default country for tests
const TEST_COUNTRY = "vietnam";
import type { ComponentScores } from "../lib/recommendation-engine/scoring";

/** Simple Vietnamese i18n mock for tests (avoids react-native import). */
function viT(key: string, params?: Record<string, string | number>): string {
  const keys = key.split(".");
  let val: any = vi;
  for (const k of keys) {
    val = val?.[k];
  }
  if (typeof val !== "string") return key;
  if (!params) return val;
  return Object.entries(params).reduce(
    (s, [k, v]) => s.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v)),
    val,
  );
}

const COMPONENTS: ComponentScores = {
  season: 90,
  temperature: 75,
  beginner: 80,
  fast_harvest: 60,
  sunspace: 70,
};

const caiXanh = getCropById(TEST_COUNTRY, "cai_xanh");
if (!caiXanh) throw new Error("crops_data.json thiếu cai_xanh");

describe("buildWhyText — nudge lịch sử thất bại", () => {
  it("có nudge khi user từng fail cây này ở tháng tương tự", () => {
    const why = buildWhyText(caiXanh, COMPONENTS, "north_vietnam", "easy", {
      month: 8,
      ghostHistory: [{ cropId: "cai_xanh", month: 7, cause: "sun_heat" }],
      // Alternative đầu tiên (điểm cao nhất trong top-3, khác cây đang xét) được chọn
      alternativeNames: ["Rau muống", "Mồng tơi"],
    }, viT);
    expect(why).toContain("Lần trước");
    expect(why).toContain("Nắng gắt");
    expect(why).toContain("Rau muống");
    expect(why).not.toContain("Mồng tơi");
  });

  it("không có nudge khi không có lịch sử thất bại", () => {
    const why = buildWhyText(caiXanh, COMPONENTS, "north_vietnam", "easy", { month: 8 }, viT);
    expect(why).not.toContain("Lần trước");
  });

  it("không có nudge khi fail cây KHÁC (không phải cây này)", () => {
    const why = buildWhyText(caiXanh, COMPONENTS, "north_vietnam", "easy", {
      month: 8,
      ghostHistory: [{ cropId: "rau_muong", month: 7, cause: "waterlogged" }],
    }, viT);
    expect(why).not.toContain("Lần trước");
  });

  it("không có nudge khi tháng cách xa (tháng 7 vs tháng 12)", () => {
    const why = buildWhyText(caiXanh, COMPONENTS, "north_vietnam", "easy", {
      month: 12,
      ghostHistory: [{ cropId: "cai_xanh", month: 7, cause: "pest" }],
    }, viT);
    expect(why).not.toContain("Lần trước");
  });

  it("nudge vẫn có khi không có cây thay thế (chỉ nhắc chú ý hơn)", () => {
    const why = buildWhyText(caiXanh, COMPONENTS, "north_vietnam", "easy", {
      month: 6,
      ghostHistory: [{ cropId: "cai_xanh", month: 5, cause: "unknown" }],
    }, viT);
    expect(why).toContain("Lần trước");
    expect(why).toContain("chú ý hơn");
  });
});
