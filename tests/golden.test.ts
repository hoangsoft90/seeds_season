/**
 * Golden Test Cases — regression suite bắt buộc (plan mục 4.4).
 *
 * Nguồn: `golden_test_cases.json` (20 case TC01-TC20).
 * - `must_include`: crop_id PHẢI xuất hiện trong Top 3 (không cần đúng thứ tự).
 * - `must_exclude`: crop_id TUYỆT ĐỐI không được xuất hiện trong Top 3.
 * - TC15: phải trả NO_MATCH_STATE.
 * - TC20: ranking input_a (mùa hè) và input_b (thu-đông) PHẢI khác nhau đáng kể —
 *   nếu giống nhau, engine đang bỏ qua Season_Fit (lỗi nghiêm trọng).
 *
 * Quy tắc: KHÔNG sửa test case để nó pass — sửa logic engine.
 */

import { describe, it, expect } from "vitest";
import golden from "../golden_test_cases.json";
import { getRecommendations } from "../lib/recommendation-engine/engine";
import { getAllCrops } from "../lib/data/crops";
import type { RecommendationContext } from "../lib/recommendation-engine/types";
import type { RecommendationResult } from "../lib/recommendation-engine/engine";

type GoldenCase = {
  id: string;
  description: string;
  input?: RecommendationContext;
  input_a?: RecommendationContext;
  input_b?: RecommendationContext;
  must_exclude?: string[];
  must_include?: string[];
  /** Top 3 phải chứa ít nhất 1 cây có category = fruit_vegetable (assert slot step-up, không quan tâm cây cụ thể). */
  must_include_fruit_vegetable?: boolean;
  expected_note?: string;
};

const cases = golden.test_cases as unknown as GoldenCase[];

const crops = getAllCrops();

function topIds(result: RecommendationResult): string[] {
  return result.recommendations.map((r) => r.crop.crop_base.id);
}

describe("Golden Test Cases", () => {
  it("dataset chứa đủ 20 test case", () => {
    expect(cases.length).toBe(20);
  });

  for (const tc of cases) {
    // TC20 có input_a/input_b (test chuyển mùa) — xử lý riêng
    if (tc.input_a && tc.input_b) {
      it(`${tc.id} — ${tc.description}`, () => {
        const a = getRecommendations(tc.input_a!, crops);
        const b = getRecommendations(tc.input_b!, crops);
        expect(a.status).toBe("ok");
        expect(b.status).toBe("ok");

        const idsA = new Set(topIds(a));
        const idsB = new Set(topIds(b));
        const overlap = [...idsA].filter((id) => idsB.has(id));

        // Đáng kể khác nhau: tối đa 1 cây trùng giữa 2 mùa
        expect(overlap.length, `${tc.expected_note ?? ""} — overlap: ${overlap.join(", ")}`).toBeLessThanOrEqual(1);
      });
      continue;
    }

    it(`${tc.id} — ${tc.description}`, () => {
      const ctx = tc.input!;
      const result = getRecommendations(ctx, crops);

      // TC15: điều kiện cực khắc nghiệt → NO_MATCH_STATE, không ép trả danh sách
      if (tc.id === "TC15") {
        expect(result.status, `${tc.expected_note ?? ""} — audit:\n${formatBrief(result)}`).toBe("no_match");
        return;
      }

      expect(result.status, `${tc.expected_note ?? ""} — audit:\n${formatBrief(result)}`).toBe("ok");

      const ids = new Set(topIds(result));

      for (const id of tc.must_include ?? []) {
        expect(
          ids.has(id),
          `TC${tc.id}: phải include "${id}" trong Top 3 (${[...ids].join(", ")})\n${tc.expected_note ?? ""}\n${formatBrief(result)}`,
        ).toBe(true);
      }

      for (const id of tc.must_exclude ?? []) {
        expect(
          !ids.has(id),
          `TC${tc.id}: cấm exclude — "${id}" không được xuất hiện trong Top 3 (${[...ids].join(", ")})\n${tc.expected_note ?? ""}\n${formatBrief(result)}`,
        ).toBe(true);
      }

      // Assert slot step-up: Top 3 phải có ≥1 cây quả (Controlled Diversity, plan 4.3)
      if (tc.must_include_fruit_vegetable) {
        const hasFruit = result.recommendations.some(
          (r) => r.crop.crop_base.category === "fruit_vegetable",
        );
        expect(
          hasFruit,
          `TC${tc.id}: Top 3 phải chứa ≥1 cây fruit_vegetable (${topIds(result).join(", ")})\n${tc.expected_note ?? ""}\n${formatBrief(result)}`,
        ).toBe(true);
      }
    });
  }
});

/** Bản tóm tắt ngắn để debug khi test fail. */
function formatBrief(result: RecommendationResult): string {
  if (result.status === "no_match") {
    return `status=no_match | candidates=${result.candidates.length} | excluded=${result.excluded.length}`;
  }
  const rows = result.recommendations.map(
    (r) =>
      `${r.role} ${r.crop.crop_base.id} (${r.score.toFixed(1)}: S${r.components.season.toFixed(0)}/T${r.components.temperature.toFixed(0)}/B${r.components.beginner.toFixed(0)}/F${r.components.fast_harvest.toFixed(0)}/X${r.components.sunspace.toFixed(0)})`,
  );
  const nextBest = result.candidates
    .slice(result.recommendations.length, result.recommendations.length + 3)
    .map((c) => `${c.crop.crop_base.id} (${c.score.toFixed(1)})`);
  return `Top3: ${rows.join(" | ")}\nNext: ${nextBest.join(", ") || "—"}`;
}
