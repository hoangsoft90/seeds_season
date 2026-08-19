/**
 * Label tiếng Việt dùng chung cho UI — nguồn duy nhất để tránh lệch nhãn giữa
 * các màn hình (crop card, crop detail...).
 */

import type { GhostCause } from "./garden/types";
import type {
  BaseDifficulty,
  CropCategory,
  ForgivenessLevel,
  Region,
  WaterNeed,
} from "./recommendation-engine/types";

export const CATEGORY_LABEL: Record<CropCategory, string> = {
  leafy_green: "Rau lá",
  herb: "Gia vị",
  root_vegetable: "Củ",
  fruit_vegetable: "Quả",
};

export const DIFFICULTY_LABEL: Record<BaseDifficulty, string> = {
  easy: "Dễ",
  medium: "Trung bình",
  hard: "Khó",
};

export const LEVEL_LABEL: Record<ForgivenessLevel, string> = {
  low: "Thấp",
  medium: "Vừa",
  high: "Cao",
};

export const WATER_LABEL: Record<WaterNeed, string> = {
  consistent_moist: "Giữ ẩm đều",
  high_tolerates_waterlogged: "Ưa ẩm cao, chịu ngập tốt",
  moderate_moist: "Ẩm vừa phải",
  moderate_moist_well_drained: "Ẩm vừa, thoát nước tốt",
  high_consistent: "Cần nước đều và nhiều",
  moderate_tolerates_rain: "Chịu mưa vừa phải",
  moderate_consistent: "Tưới đều, vừa phải",
};

const SOIL_LABELS: Record<string, string> = {
  well_draining_loamy_rich: "Đất tơi xốp, giàu dinh dưỡng, thoát nước tốt",
  any_well_fertilized: "Đất nào cũng được, miễn bón phân tốt",
  loamy_fertile: "Đất thịt, màu mỡ",
  well_draining_loamy: "Đất thịt, thoát nước tốt",
  well_draining: "Đất thoát nước tốt",
  any_fertile: "Đất màu mỡ (nói chung)",
  loose_deep_sandy_loam: "Đất tơi xốp, sâu, pha cát",
  rich_well_draining: "Đất giàu dinh dưỡng, thoát nước tốt",
  loose_fertile: "Đất tơi xốp, màu mỡ",
};

export function soilLabel(soil: string): string {
  return SOIL_LABELS[soil] ?? soil;
}

export const REGION_LABELS: Record<Region, string> = {
  north_vietnam: "Miền Bắc",
  south_vietnam: "Miền Nam",
  highland_vietnam: "Vùng cao (Đà Lạt)",
};

export const WINDOW_TYPE_LABEL: Record<string, string> = {
  primary: "Vụ chính",
  primary_dry_season: "Mùa khô chính",
  year_round: "Quanh năm",
  late_spring_risky: "Cuối xuân (rủi ro)",
};

/** Nguyên nhân cây chết (Ghost Plant — change my-garden). Emoji đi kèm để chọn nhanh. */
export const GHOST_CAUSE_LABEL: Record<GhostCause, string> = {
  sun_heat: "☀️ Nắng gắt / héo",
  pest: "🐛 Sâu bệnh",
  waterlogged: "🌊 Úng nước",
  unknown: "❓ Không rõ",
};

/** Harvest Brag Card — giá trị sản lượng quy đổi (change harvest-brag-card). */
export const DEFAULT_YIELD_KG: Record<string, number> = {
  leafy_green: 0.3,
  herb: 0.1,
  root_vegetable: 0.5,
  fruit_vegetable: 0.8,
};

export const MARKET_PRICE_PER_KG: Record<string, number> = {
  leafy_green: 30_000,
  herb: 50_000,
  root_vegetable: 25_000,
  fruit_vegetable: 35_000,
};
