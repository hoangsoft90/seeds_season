/**
 * Explanation "Why" — template text (chưa dùng AI, Phase 2 sẽ thay bằng lớp
 * diễn giải tự nhiên hơn — plan mục 7). Dựa trên điểm từng thành phần của engine.
 *
 * Từ change `my-garden`: nhận thêm lịch sử thất bại (ghost plants) của user để
 * thêm câu nudge cá nhân hoá — Data Moat. Chỉ THÊM text, KHÔNG đổi điểm engine
 * (Golden Tests 21/21 phải giữ nguyên).
 */

import type { ComponentScores } from "./recommendation-engine/scoring";
import type { Crop, Region } from "./recommendation-engine/types";
import { GHOST_CAUSE_LABEL } from "./labels";

/** Một lần thất bại trong quá khứ (từ ghost history của user). */
export interface GhostHistoryEntry {
  cropId: string;
  /** Tháng đã trồng/fail (1-12). */
  month: number;
  cause: string;
}

export interface WhyOptions {
  /** Tháng hiện tại (để so "tháng tương tự" với lịch sử thất bại). */
  month?: number;
  ghostHistory?: GhostHistoryEntry[];
  /** Tên các cây khác đang được gợi ý — dùng làm phương án thay thế. */
  alternativeNames?: string[];
  /** Dynamic region labels from CountryConfig. Falls back to hardcoded Vietnam labels. */
  regionLabels?: Record<string, string>;
}

/** Hai tháng được coi là "tương tự" nếu lệch ≤1 (vòng quanh năm, Dec↔Jan gần nhau). */
function similarMonth(a: number, b: number): boolean {
  const diff = Math.abs(a - b);
  return diff <= 1 || diff >= 11;
}

/** Giải thích ngắn (1-2 câu) cho một recommendation. */
export function buildWhyText(
  crop: Crop,
  components: ComponentScores,
  region: Region,
  role: "easy" | "step_up",
  opts: WhyOptions = {},
): string {
  const name = crop.crop_base.names.canonical_vi;
  const parts: string[] = [];

  if (role === "step_up") {
    parts.push(
      `${name} là cây "bước lên" — khó hơn rau lá một chút, nhưng nếu thành công bạn sẽ có quả ăn thật!`,
    );
  }

  // Use dynamic region labels if provided, otherwise fall back to region string
  const regionLabel = opts.regionLabels?.[region] ?? region;

  if (components.season >= 80) {
    parts.push(`đang đúng thời vụ ở ${regionLabel.toLowerCase()}`);
  } else if (components.season < 40) {
    parts.push(`hơi trái mùa ở ${regionLabel.toLowerCase()}, trồng thử vẫn được nhưng cần chú ý hơn`);
  }

  if (components.temperature >= 70) {
    parts.push("nhiệt độ đang thuận lợi");
  } else {
    parts.push("nhiệt độ không lý tưởng, cần che chắn bớt");
  }

  if (components.beginner >= 70) {
    parts.push("rất dễ trồng, phù hợp người mới bắt đầu");
  }

  const [minDays, maxDays] = crop.crop_base.timeline_base.days_to_harvest;
  if (components.fast_harvest >= 70) {
    parts.push(`thu hoạch nhanh trong khoảng ${minDays}-${maxDays} ngày`);
  } else {
    parts.push(`cần kiên nhẫn (${minDays}-${maxDays} ngày mới thu hoạch)`);
  }

  // Nudge theo lịch sử thất bại (data moat — plan mục 6): user từng trồng cây này
  // ở tháng tương tự và thất bại → nhắc nhẹ + gợi ý cây thay thế (nếu có).
  const ghost = opts.ghostHistory?.find(
    (g) => g.cropId === crop.crop_base.id && opts.month !== undefined && similarMonth(g.month, opts.month),
  );
  if (ghost) {
    const causeLabel = GHOST_CAUSE_LABEL[ghost.cause as keyof typeof GHOST_CAUSE_LABEL] ?? ghost.cause;
    const alternative = opts.alternativeNames?.find((n) => n !== name);
    if (alternative) {
      parts.push(
        `Lần trước (tháng ${ghost.month}) bạn trồng ${name} nhưng ${causeLabel.toLowerCase()}. Tháng này thử ${alternative} thay thế nhé!`,
      );
    } else {
      parts.push(
        `Lần trước (tháng ${ghost.month}) bạn trồng ${name} nhưng ${causeLabel.toLowerCase()}. Trồng lại thì chú ý hơn nhé!`,
      );
    }
  }

  return parts.join(". ") + ".";
}
