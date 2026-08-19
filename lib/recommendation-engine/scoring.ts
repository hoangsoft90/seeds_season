/**
 * Scoring — các thành phần của EXPECTED SUCCESS SCORE (plan mục 4.3).
 *
 *   Final = Season_Fit*0.30 + Temp_Optimal_Fit*0.25 + Beginner_Ease*0.20
 *         + Fast_Harvest_Bonus*0.15 + Sunlight/Space_Fit*0.10
 *
 * Trọng số có thể dịch chuyển theo `user_goal` / `user_experience` (luôn chuẩn hoá
 * về tổng 1.0) — xem các test case TC09/TC10/TC12/TC19.
 *
 * ⚠️ NHỮNG GÌ KHÔNG NẰM TRONG SCORING: ngưỡng sống-chết (hard constraints) là bộ lọc
 * LOẠI TRỪ TRƯỚC, không phải một thành phần điểm. Đừng refactor thành "weighted
 * average thuần tuý" để cứu cây vượt ngưỡng chết (xem plan mục 4.2, 9).
 */

import type {
  Crop,
  RecommendationContext,
  WeatherInfo,
} from "./types";

// ---------------------------------------------------------------------------
// Bộ trọng số theo goal / experience (đã chuẩn hoá tổng = 1.0)
// ---------------------------------------------------------------------------

export interface ScoreWeights {
  season: number;
  temperature: number;
  beginner: number;
  fast_harvest: number;
  sunspace: number;
}

export const DEFAULT_WEIGHTS: ScoreWeights = {
  season: 0.3,
  temperature: 0.25,
  beginner: 0.2,
  fast_harvest: 0.15,
  sunspace: 0.1,
};

/** ⚡ Thu hoạch nhanh nhất → Fast_Harvest_Bonus tăng mạnh. */
const FASTEST_HARVEST_WEIGHTS: ScoreWeights = {
  season: 0.25,
  temperature: 0.2,
  beginner: 0.15,
  fast_harvest: 0.35,
  sunspace: 0.05,
};

/** 🍅 Rau củ quả ăn hàng ngày → Fast_Harvest nhích nhẹ (để single_harvest bị loại). */
const DAILY_FOOD_WEIGHTS: ScoreWeights = {
  season: 0.3,
  temperature: 0.25,
  beginner: 0.15,
  fast_harvest: 0.2,
  sunspace: 0.1,
};

/** 🌿 Dễ sống, ít công chăm → Beginner_Ease + Sun/Space lên, Temp xuống. */
const EASY_CARE_WEIGHTS: ScoreWeights = {
  season: 0.25,
  temperature: 0.15,
  beginner: 0.3,
  fast_harvest: 0.1,
  sunspace: 0.2,
};

/**
 * Beginner tuyệt đối (không chọn goal) → Beginner_Ease lên; Sun/Space cũng quan
 * trọng (cây cần ít nắng/ít chăm = dễ hơn), Temp giảm bớt trọng số.
 */
const ABSOLUTE_BEGINNER_WEIGHTS: ScoreWeights = {
  season: 0.3,
  temperature: 0.15,
  beginner: 0.3,
  fast_harvest: 0.1,
  sunspace: 0.15,
};

export function getWeights(context: RecommendationContext): ScoreWeights {
  if (context.user_goal === "fastest_harvest") return FASTEST_HARVEST_WEIGHTS;
  if (context.user_goal === "daily_food") return DAILY_FOOD_WEIGHTS;
  if (context.user_goal === "easy_care") return EASY_CARE_WEIGHTS;
  if (context.user_experience === "absolute_beginner") return ABSOLUTE_BEGINNER_WEIGHTS;
  return DEFAULT_WEIGHTS;
}

// ---------------------------------------------------------------------------
// Component scorers (mỗi thành phần trả 0-100)
// ---------------------------------------------------------------------------

const clamp = (v: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, v));

const DIFFICULTY_SCORE = { easy: 100, medium: 55, hard: 20 } as const;
const LEVEL_SCORE = { low: 30, medium: 60, high: 90 } as const;

/** Nhãn tháng cho các anomaly flag key quen thuộc trong dữ liệu. */
function anomalyFlagApplies(key: string, ctx: RecommendationContext, weather: WeatherInfo): boolean {
  const m = ctx.month;
  const cond = weather.forecast_condition ?? "";
  switch (key) {
    case "june_july_heatwave":
      // Đúng tên flag: chỉ tháng 6-7 (không phải tháng 8 — mùa mưa bắt đầu dịu hơn)
      return m === 6 || m === 7;
    case "summer_heat":
    case "summer":
      return m === 6 || m === 7 || m === 8;
    case "winter":
    case "winter_cold":
    case "winter_cold_spell":
      return m === 12 || m === 1 || m === 2;
    case "rainy_season":
      // Miền Nam mùa mưa tháng 5-10; forecast mưa dầm cũng kích hoạt
      return m >= 5 && m <= 10 ? true : cond.includes("rain");
    case "hot_months":
      return m >= 4 && m <= 8;
    case "most_months":
      // Đánh dấu "quá nóng hầu hết các tháng" (VD su_hao ở miền Nam)
      return ctx.region === "south_vietnam";
    default:
      return false;
  }
}

/** Điểm theo kiểu planting window (type càng "chắc chắn" càng cao). */
const WINDOW_TYPE_SCORE: Record<string, number> = {
  primary: 100,
  primary_dry_season: 100,
  year_round: 95,
  late_spring_risky: 60,
};

/**
 * Season_Fit (0-100).
 *
 * QUYẾT ĐỊNH THIẾT KẾ: season KHÔNG phải hard constraint — nó là một thành phần điểm.
 * Lý do: TC14 ghi rõ "cai_xanh KHÔNG bị loại cứng (vẫn theo mùa)" và TC04 yêu cầu
 * xa_lach (tháng 9, ngoài cửa sổ trồng của nó) vẫn vào Top 3. Season ngoài cửa sổ
 * chỉ bị chấm rất thấp (20/100), đủ để hạ rank các cây trái mùa mà không cần "cứu"
 * chúng bằng weighted average (xem audit mode).
 *
 * Vùng không có regional_rules (highland_vietnam, TC16) → fallback theo nhiệt độ
 * (dùng lại Temp_Optimal_Fit) thay vì áp nhầm quy tắc north/south.
 */
export function seasonFit(
  crop: Crop,
  ctx: RecommendationContext,
  weather: WeatherInfo,
): number {
  const rules = crop.growing_rules.regional_rules;
  const regional = rules[ctx.region as keyof typeof rules];

  let score: number;

  if (regional && regional.planting_windows.length > 0) {
    const inWindow = regional.planting_windows.find((w) => w.months.includes(ctx.month));
    if (inWindow) {
      score = WINDOW_TYPE_SCORE[inWindow.type ?? ""] ?? 85;
    } else {
      score = 20; // trái mùa — thấp nhưng không hard-exclude
    }

    // Anomaly flag trùng với tháng/dự báo → hạ mạnh (VD june_july_heatwave, rainy_season)
    for (const key of Object.keys(regional.local_anomaly_flags ?? {})) {
      if (anomalyFlagApplies(key, ctx, weather)) {
        score -= 35;
        break;
      }
    }
  } else {
    // Fallback: vùng chưa có regional_rules → dựa vào nhiệt độ theo mùa
    score = tempOptimalFit(crop, weather);
  }

  // Dự báo mưa dầm → ưu tiên cây chịu ngập (TC08/TC17)
  if ((weather.forecast_condition ?? "").includes("rain")) {
    const water = crop.growing_rules.optimal_conditions.water;
    if (water === "high_tolerates_waterlogged" || crop.crop_base.tags.includes("flood_tolerant")) {
      score += 15;
    }
  }

  return clamp(score);
}

/**
 * Temp_Optimal_Fit (0-100) — mức độ "dễ chịu" của nhiệt độ hiện tại so với
 * optimal_conditions.temperature_c. Dùng nhiệt độ trung bình (min+max)/2.
 * Trong khoảng optimal → 100; lệch về phía hard min/max → giảm dần còn 40.
 */
export function tempOptimalFit(crop: Crop, weather: WeatherInfo): number {
  const t = ((weather.forecast_temp_max_c ?? 30) + (weather.forecast_temp_min_c ?? 20)) / 2;
  const range = crop.growing_rules.optimal_conditions.temperature_c;

  if (t >= range.optimal_min && t <= range.optimal_max) return 100;
  if (t < range.optimal_min) {
    if (t <= range.min) return 40;
    return clamp(100 - ((range.optimal_min - t) / (range.optimal_min - range.min)) * 60);
  }
  // t > optimal_max
  if (t >= range.max) return 40;
  return clamp(100 - ((t - range.optimal_max) / (range.max - range.optimal_max)) * 60);
}

/**
 * Beginner_Ease (0-100) — độ "tha thứ" cho người mới:
 * 40% base_difficulty + 20% chịu úng + 20% chịu khô + 20% kháng bệnh.
 */
export function beginnerEase(crop: Crop): number {
  const f = crop.beginner_success_factors;
  return (
    0.4 * DIFFICULTY_SCORE[crop.crop_base.base_difficulty] +
    0.2 * LEVEL_SCORE[f.forgiveness_overwatering] +
    0.2 * LEVEL_SCORE[f.forgiveness_underwatering] +
    0.2 * LEVEL_SCORE[f.disease_resistance]
  );
}

/**
 * Fast_Harvest_Bonus (0-100).
 *
 * Mặc định: đường cong Gaussian đỉnh ở 30 ngày (ideal=30 theo pseudo-code mục 4.3)
 * — cây ~30 ngày được thưởng tối đa, chậm hơn thì giảm.
 *
 * Khi goal = fastest_harvest (⚡): "nhanh" phải nghĩa là CÀNG NHANH CÀNG TỐT,
 * nên đổi sang hàm đơn điệu giảm (đỉnh ~15 ngày). Nếu vẫn dùng đỉnh 30 ngày thì
 * cây thu hoạch 20 ngày (hanh_la) bị chấm thấp hơn cây 30 ngày (cai_xanh) — ngược
 * với chính mục đích của goal (xem TC09).
 */
export function fastHarvestBonus(crop: Crop, ctx: RecommendationContext): number {
  const [minDays, maxDays] = crop.crop_base.timeline_base.days_to_harvest;
  const midDays = (minDays + maxDays) / 2;
  const ideal = ctx.user_goal === "fastest_harvest" ? 15 : 30;
  const decay = Math.exp(-Math.pow((midDays - ideal) / 25, 2));
  return clamp(decay * 100, 5, 100);
}

/** Sunlight/Space_Fit (0-100) — giờ nắng so với nhu cầu + proxy vị trí (mục 5.1). */
export function sunspaceFit(crop: Crop, ctx: RecommendationContext): number {
  const optimal = crop.growing_rules.optimal_conditions.sunlight_hours.optimal;
  const sunFit = 100 * Math.min(1, ctx.sunlight_hours / optimal);
  const spaceFit =
    ctx.location_type === "garden" ? 100 : ctx.location_type === "balcony" ? 75 : 45;
  return clamp(0.7 * sunFit + 0.3 * spaceFit);
}

// ---------------------------------------------------------------------------
// Tổng hợp
// ---------------------------------------------------------------------------

export interface ComponentScores {
  season: number;
  temperature: number;
  beginner: number;
  fast_harvest: number;
  sunspace: number;
}

/** Tính Expected Success Score + các thành phần cho một candidate. */
export function scoreCrop(
  crop: Crop,
  ctx: RecommendationContext,
  weather: WeatherInfo,
  weights: ScoreWeights,
): { score: number; components: ComponentScores } {
  const components: ComponentScores = {
    season: seasonFit(crop, ctx, weather),
    temperature: tempOptimalFit(crop, weather),
    beginner: beginnerEase(crop),
    fast_harvest: fastHarvestBonus(crop, ctx),
    sunspace: sunspaceFit(crop, ctx),
  };

  let score =
    weights.season * components.season +
    weights.temperature * components.temperature +
    weights.beginner * components.beginner +
    weights.fast_harvest * components.fast_harvest +
    weights.sunspace * components.sunspace;

  // 🍅 daily_food: cây thu hoạch 1 lần (single_harvest) bị hạ điểm so với cây hái lá dần (TC10)
  if (ctx.user_goal === "daily_food" && crop.crop_base.tags.includes("single_harvest")) {
    score -= 30;
  }

  // Feedback loop: tỷ lệ chết cộng đồng cao → hạ rank mạnh, KHÔNG hard exclude (TC14)
  const failRate = ctx.community_fail_rate_override?.[crop.crop_base.id];
  if (failRate != null && failRate > 0) {
    score *= 1 - failRate * 0.8;
  }

  return { score: clamp(score, 0, 100), components };
}
