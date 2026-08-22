/**
 * Labels — i18n-aware translations for all UI labels.
 * Uses t() from i18n for multi-language support.
 */

import type { GhostCause } from "./garden/types";
import type {
  BaseDifficulty,
  CropCategory,
  ForgivenessLevel,
  WaterNeed,
} from "./recommendation-engine/types";
import { t } from "./i18n";

/** Category label — returns translated string. */
export function categoryLabel(cat: CropCategory): string {
  return t(`labels.categories.${cat}`) || cat;
}

/** Difficulty label — returns translated string. */
export function difficultyLabel(diff: BaseDifficulty): string {
  return t(`labels.difficulty.${diff}`) || diff;
}

/** Forgiveness level label. */
export function levelLabel(level: ForgivenessLevel): string {
  return t(`labels.level.${level}`) || level;
}

/** Water need label — returns translated string. */
export function waterLabel(water: WaterNeed): string {
  return t(`labels.water.${water}`) || water;
}

/** Soil label (still Vietnamese — soil terms are technical). */
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

/** Ghost cause label — returns translated string. */
export function ghostCauseLabel(cause: GhostCause): string {
  return t(`labels.ghost.${cause}`) || cause;
}

/** Window type label — returns translated string. */
export function windowTypeLabel(type: string): string {
  return t(`labels.window.${type}`) || type;
}

// Backward-compatible static exports (deprecated — use functions above)
// These are kept for code that hasn't been migrated yet.
export const CATEGORY_LABEL: Record<CropCategory, string> = {
  leafy_green: t("labels.categories.leafy_green") || "Leafy greens",
  herb: t("labels.categories.herb") || "Herbs",
  root_vegetable: t("labels.categories.root_vegetable") || "Root veg",
  fruit_vegetable: t("labels.categories.fruit_vegetable") || "Fruit veg",
};

export const DIFFICULTY_LABEL: Record<BaseDifficulty, string> = {
  easy: t("labels.difficulty.easy") || "Easy",
  medium: t("labels.difficulty.medium") || "Medium",
  hard: t("labels.difficulty.hard") || "Hard",
};

export const WATER_LABEL: Record<WaterNeed, string> = {
  consistent_moist: t("labels.water.consistent_moist") || "Keep moist",
  high_tolerates_waterlogged: t("labels.water.high_tolerates_waterlogged") || "Likes water",
  moderate_moist: t("labels.water.moderate_moist") || "Moderate moisture",
  moderate_moist_well_drained: t("labels.water.moderate_moist_well_drained") || "Moderate, well-drained",
  high_consistent: t("labels.water.high_consistent") || "Needs regular water",
  moderate_tolerates_rain: t("labels.water.moderate_tolerates_rain") || "Tolerates rain",
  moderate_consistent: t("labels.water.moderate_consistent") || "Regular, moderate",
};

export const GHOST_CAUSE_LABEL: Record<GhostCause, string> = {
  sun_heat: t("labels.ghost.sun_heat") || "☀️ Sun scorch",
  pest: t("labels.ghost.pest") || "🐛 Pests",
  waterlogged: t("labels.ghost.waterlogged") || "🌊 Root rot",
  unknown: t("labels.ghost.unknown") || "❓ Unknown",
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
