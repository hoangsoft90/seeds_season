/**
 * Recommendation Audit Mode — dev-only, KHÔNG hiển thị cho user (plan mục 5.6).
 *
 * Xuất ra: điểm từng thành phần (Season/Temp/Beginner/Fast_Harvest/Sun-Space) của
 * mọi candidate + lý do exclude của mọi cây bị loại. Dùng để developer verify
 * engine khi review code.
 *
 * Dữ liệu audit được engine trả về sẵn trong `RecommendationResult`
 * (candidates + excluded) — audit.ts chỉ định dạng + in ra.
 */

import type { RecommendationContext } from "./types";
import type { RecommendationResult, ScoredCandidate, ExcludedCrop } from "./engine";

/** In audit ra console (dùng trong CLI/dev script). */
export function logAudit(result: RecommendationResult, context: RecommendationContext): void {
  console.log(formatAudit(result, context));
}

/** Định dạng audit thành chuỗi text dễ đọc. */
export function formatAudit(result: RecommendationResult, context: RecommendationContext): string {
  const lines: string[] = [];
  lines.push(
    `Recommendation Audit — ${context.region}, tháng ${context.month}, ${context.location_type}` +
      ` (${context.sunlight_hours}h nắng, chậu ${context.pot_depth_cm ?? "đất"}cm)`,
  );
  lines.push("-".repeat(70));

  if (result.status === "no_match") {
    lines.push("NO_MATCH_STATE — không cây nào qua Hard Constraints.");
  } else {
    for (const rec of result.recommendations) {
      lines.push(formatCandidate(rec, "=> "));
    }
    // Các candidate còn lại (không vào Top 3)
    const topIds = new Set(result.recommendations.map((r) => r.crop.crop_base.id));
    for (const c of result.candidates) {
      if (!topIds.has(c.crop.crop_base.id)) {
        lines.push(formatCandidate(c, "   "));
      }
    }
  }

  lines.push("-".repeat(70));
  lines.push(`Excluded (${result.excluded.length} cây):`);
  for (const ex of result.excluded) {
    lines.push(formatExcluded(ex));
  }
  if (result.excluded.length === 0) lines.push("(không cây nào bị loại)");

  return lines.join("\n");
}

function formatCandidate(c: ScoredCandidate, prefix: string): string {
  const name = c.crop.crop_base.names.canonical_vi;
  const { season, temperature, beginner, fast_harvest, sunspace } = c.components;
  return [
    `${prefix}Crop: ${name}`,
    `   Season: ${season.toFixed(0)} | Temp: ${temperature.toFixed(0)} | Beginner: ${beginner.toFixed(0)} | FastHarvest: ${fast_harvest.toFixed(0)} | Sun/Space: ${sunspace.toFixed(0)}`,
    `   Final Score: ${c.score.toFixed(1)}`,
    `   Reasons: ${reasonLine(c)}`,
  ].join("\n");
}

function formatExcluded(ex: ExcludedCrop): string {
  const name = ex.crop.crop_base.names.canonical_vi;
  return ex.reasons.map((r) => `   ${r}`).join("\n") || `   ${name} — (không rõ lý do)`;
}

/** Dòng "Reasons: ✓ ..." ngắn gọn cho một candidate. */
function reasonLine(c: ScoredCandidate): string {
  const ticks: string[] = [];
  if (c.components.season >= 80) ticks.push("cửa sổ trồng đang mở");
  if (c.components.temperature >= 70) ticks.push("nhiệt độ thuận lợi");
  if (c.components.beginner >= 70) ticks.push("thân thiện người mới");
  if (c.components.fast_harvest >= 70) ticks.push("thu hoạch nhanh");
  if (ticks.length === 0) ticks.push("điều kiện trung bình");
  return ticks.map((t) => `✓ ${t}`).join(" ");
}
