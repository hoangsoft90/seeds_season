/**
 * Recommendation Engine — pipeline mục 4.3:
 *
 *   Hard Constraints Filter → Candidate Crops → Expected Success Score
 *   → Controlled Diversity (2 easy + 1 step-up) → Top 3 | NO_MATCH_STATE
 *
 * North Star: "Cây nào tôi có khả năng trồng THÀNH CÔNG nhất ngay bây giờ?" —
 * không phải "Cây nào phù hợp khí hậu của tôi?" (plan mục 0.6).
 *
 * ⚠️ RANH GIỚI BẤT BIẾN (đừng refactor nhầm):
 * - `applyHardConstraints` LOẠI TRỪ TUYỆT ĐỐI trước scoring: temp vượt ngưỡng chết,
 *   thiếu nắng tối thiểu, chậu nông hơn nhu cầu rễ → cây BỊ LOẠI NGAY.
 * - Scoring (`scoreCrop`) chỉ XẾP HẠNG các cây ĐÃ SỐNG ĐƯỢC. Không bao giờ để
 *   weighted average "cứu" một cây đã vượt ngưỡng chết lên top.
 * - Nếu hard constraints loại hết → trả NO_MATCH_STATE, không ép trả danh sách
 *   gượng ép (plan mục 5.4).
 *
 * Lưu ý thiết kế: season KHÔNG phải hard constraint (xem comment trong scoring.ts) —
 * nó là một thành phần điểm để các cây trái mùa bị hạ rank thay vì loại cứng.
 */

import { DummyWeatherProvider, resolveWeather, type WeatherProvider } from "./weather";
import {
  getWeights,
  scoreCrop,
  type ComponentScores,
} from "./scoring";
import type { Crop, RecommendationContext, WeatherInfo } from "./types";

// ---------------------------------------------------------------------------
// Output types
// ---------------------------------------------------------------------------

export interface ExcludedCrop {
  crop: Crop;
  /** Lý do loại (1 hoặc nhiều) — dùng cho Audit Mode. */
  reasons: string[];
}

export interface ScoredCandidate {
  crop: Crop;
  score: number;
  components: ComponentScores;
}

export type RecommendationRole = "easy" | "step_up";

export interface Recommendation {
  crop: Crop;
  score: number;
  components: ComponentScores;
  role: RecommendationRole;
}

export interface NoMatchState {
  status: "no_match";
  recommendations: [];
  /** Thông điệp mục 5.4 — hiển thị cho user. */
  message: string;
  candidates: ScoredCandidate[];
  excluded: ExcludedCrop[];
}

export interface OkState {
  status: "ok";
  recommendations: Recommendation[];
  candidates: ScoredCandidate[];
  excluded: ExcludedCrop[];
}

export type RecommendationResult = OkState | NoMatchState;

/** Trạng thái khi sau Hard Constraints không còn candidate nào. */
export const NO_MATCH_MESSAGE =
  "⚠️ Điều kiện hiện tại khá khắc nghiệt. Gợi ý chờ 1-2 tuần hoặc thử trồng trong nhà/nấm/mầm hạt.";

// ---------------------------------------------------------------------------
// Hard Constraints Filter
// ---------------------------------------------------------------------------

/**
 * Bộ lọc ngưỡng SỐNG-CHẾT tuyệt đối. Trả về danh sách lý do nếu cây bị loại.
 * Không có lý do nào → cây sống sót (pass).
 */
export function applyHardConstraints(
  crop: Crop,
  ctx: RecommendationContext,
  weather: WeatherInfo,
): { pass: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const hc = crop.hard_constraints;

  // Nhiệt độ vượt ngưỡng chết (dùng dự báo nếu có, ngược lại dummy theo mùa)
  const tempMax = weather.forecast_temp_max_c;
  if (tempMax != null && tempMax > hc.temp_death_max_c.value) {
    reasons.push(
      `✗ ${crop.crop_base.names.canonical_vi} — nhiệt độ tối đa ${tempMax}°C vượt ngưỡng chết ${hc.temp_death_max_c.value}°C (${hc.temp_death_max_c.reason})`,
    );
  }

  const tempMin = weather.forecast_temp_min_c;
  if (tempMin != null && tempMin < hc.temp_death_min_c.value) {
    reasons.push(
      `✗ ${crop.crop_base.names.canonical_vi} — nhiệt độ tối thiểu ${tempMin}°C dưới ngưỡng chết ${hc.temp_death_min_c.value}°C (${hc.temp_death_min_c.reason})`,
    );
  }

  // Thiếu nắng tối thiểu để sống
  if (ctx.sunlight_hours < hc.min_sunlight_hours) {
    reasons.push(
      `✗ ${crop.crop_base.names.canonical_vi} — cần ≥${hc.min_sunlight_hours}h nắng/ngày nhưng chỉ có ${ctx.sunlight_hours}h`,
    );
  }

  // Chậu nông hơn độ sâu rễ tối thiểu (chỉ áp khi user khai báo pot_depth; null = trồng đất)
  if (ctx.pot_depth_cm != null && ctx.pot_depth_cm < hc.min_pot_depth_cm) {
    reasons.push(
      `✗ ${crop.crop_base.names.canonical_vi} — cần chậu sâu ≥${hc.min_pot_depth_cm}cm nhưng chỉ có ${ctx.pot_depth_cm}cm`,
    );
  }

  return { pass: reasons.length === 0, reasons };
}

// ---------------------------------------------------------------------------
// Controlled Diversity
// ---------------------------------------------------------------------------

/** Step-up crop: cây quả dễ nhất còn sống sót (category=fruit_vegetable, điểm cao nhất). */
function pickStepUp(candidates: ScoredCandidate[]): ScoredCandidate | null {
  const fruit = candidates.filter((c) => c.crop.crop_base.category === "fruit_vegetable");
  if (fruit.length === 0) return null;
  return fruit[0]; // candidates đã sort desc theo score
}

/**
 * Top 3 = 2 easy (điểm cao nhất) + 1 step-up — ĐÚNG THEO PLAN mục 4.3:
 *
 *   top_2 = ranked[:2]                    // 2 cây dễ nhất theo Expected Success Score
 *   step_up = find_best_step_up(candidates) // category == fruit_vegetable, dễ nhất trong nhóm
 *
 * Step-up được chọn RIÊNG BIỆT khỏi ranking tổng: slot 3 luôn là cây quả tốt nhất
 * còn sống sót sau Hard Constraints, kể cả khi điểm thấp hơn cây rau lá đứng thứ 3.
 * Đây là cấu trúc cố ý — "2 easy + 1 step-up" là bản chất của Controlled Diversity
 * (xem TC13 note: "nếu chỉ toàn rau lá dễ là SAI logic"). KHÔNG đổi thành "top 3 theo
 * điểm thuần tuý".
 *
 * Ngoại lệ duy nhất: KHÔNG còn cây quả nào sống sót (VD thiếu nắng/chậu nông →
 * TC01/TC04/TC08) → slot 3 lấy cây easy kế tiếp (không thể ép step-up từ cây đã bị
 * hard-exclude).
 */
function selectTop3(candidates: ScoredCandidate[]): Recommendation[] {
  const stepUp = pickStepUp(candidates);

  const easyPool = stepUp
    ? candidates.filter((c) => c.crop.crop_base.id !== stepUp.crop.crop_base.id)
    : candidates;

  const easy = easyPool.slice(0, 2).map((c) => ({ ...c, role: "easy" as const }));

  const list: Recommendation[] = [...easy];
  if (stepUp) {
    list.push({ ...stepUp, role: "step_up" });
  } else if (easyPool[2]) {
    // Không còn cây quả nào sống sót → slot 3 lấy cây easy kế tiếp
    list.push({ ...easyPool[2], role: "easy" as const });
  }

  return list;
}

// ---------------------------------------------------------------------------
// Main entry
// ---------------------------------------------------------------------------

/**
 * Trả Top 3 (2 easy + 1 step-up) hoặc NO_MATCH_STATE.
 * Luôn kèm `candidates` + `excluded` đầy đủ để Audit Mode (Bước 4) log mà không
 * cần chạy lại engine.
 */
export function getRecommendations(
  context: RecommendationContext,
  crops: Crop[],
  weatherProvider: WeatherProvider = new DummyWeatherProvider(),
): RecommendationResult {
  const weather = resolveWeather(context, weatherProvider);
  const weights = getWeights(context);

  const candidates: ScoredCandidate[] = [];
  const excluded: ExcludedCrop[] = [];

  // STEP 1: HARD CONSTRAINTS FILTER
  for (const crop of crops) {
    const { pass, reasons } = applyHardConstraints(crop, context, weather);
    if (!pass) {
      excluded.push({ crop, reasons });
      continue;
    }

    // STEP 2: EXPECTED SUCCESS SCORE
    const { score, components } = scoreCrop(crop, context, weather, weights);
    candidates.push({ crop, score, components });
  }

  // Không còn candidate nào → NO_MATCH_STATE (không ép trả danh sách gượng ép)
  if (candidates.length === 0) {
    return {
      status: "no_match",
      recommendations: [],
      message: NO_MATCH_MESSAGE,
      candidates,
      excluded,
    };
  }

  candidates.sort((a, b) => b.score - a.score);

  // STEP 3: CONTROLLED DIVERSITY
  const recommendations = selectTop3(candidates);

  return {
    status: "ok",
    recommendations,
    candidates,
    excluded,
  };
}
