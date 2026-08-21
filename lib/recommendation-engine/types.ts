/**
 * Data Model — Schema v2 (xem `plan1_final_v2.md` mục 4.2).
 *
 * Quy tắc kiến trúc bắt buộc: lưu 1 record/JSON trong DB nhưng TÁCH rõ 4 nhóm type
 * trong code: `CropBase` / `HardConstraints` / `GrowingRules` / `BeginnerSuccessFactors`.
 * Mục đích: tránh Agent code vô tình ghi đè metadata tĩnh (crop_base) khi cập nhật
 * quy tắc vùng miền (growing_rules.regional_rules), và để engine xử lý mỗi nhóm đúng vai trò.
 */

// ============================================================================
// Nhóm 1 — CropBase: metadata tĩnh, KHÔNG được ghi đè bởi logic recommendation
// ============================================================================

export type CropCategory = "leafy_green" | "herb" | "root_vegetable" | "fruit_vegetable";
export type BaseDifficulty = "easy" | "medium" | "hard";
export type Confidence = "high" | "medium" | "low";

export interface CropNames {
  canonical_vi: string;
  canonical_en: string;
  scientific: string;
  synonyms_vi: string[];
  search_aliases: string[];
}

export interface GrowthStage {
  stage: string;
  day_range: [number, number];
}

export interface TimelineBase {
  germination_days: [number, number];
  days_to_harvest: [number, number];
  growth_stages: GrowthStage[];
}

export interface DataProvenance {
  created_at: string;
  last_verified_at: string;
  reviewed_by: string;
}

export interface CropBase {
  id: string;
  names: CropNames;
  category: CropCategory;
  base_difficulty: BaseDifficulty;
  tags: string[];
  timeline_base: TimelineBase;
  data_provenance: DataProvenance;
}

// ============================================================================
// Nhóm 2 — HardConstraints: ngưỡng SỐNG-CHẾT tuyệt đối.
//
// ⚠️ VÌ SAO NHÓM NÀY TÁCH RIÊNG KHỎI SCORING (đừng refactor nhầm):
//   Hard constraints là bộ lọc LOẠI TRỪ trước khi scoring — nếu một cây vượt ngưỡng
//   chết (temp, ánh sáng, độ sâu chậu) thì bị EXCLUDE ngay, KHÔNG được để weighted
//   average của Expected Success Score "cứu" nó về top. Weighted average chỉ xếp hạng
//   các cây ĐÃ SỐNG ĐƯỢC, không quyết định cây nào sống được.
//   (xem plan1_final_v2.md mục 4.2, 4.3, và mục 9 "Rủi ro")
// ============================================================================

export interface SourceRef {
  name: string;
  confidence: Confidence;
}

/** Ngưỡng nhiệt độ kèm lý do + nguồn (provenance cấp field để hiển thị "dựa trên ít dữ liệu địa phương"). */
export interface ThresholdWithSource {
  value: number;
  reason: string;
  source: SourceRef;
}

export interface HardConstraints {
  /** Nhiệt độ tối đa mà cây CHẾT/không thể sống (vượt → EXCLUDE). */
  temp_death_max_c: ThresholdWithSource;
  /** Nhiệt độ tối thiểu mà cây CHẾT (xuống dưới → EXCLUDE). */
  temp_death_min_c: ThresholdWithSource;
  /** Số giờ nắng tối thiểu cây cần để sống (dưới → EXCLUDE). */
  min_sunlight_hours: number;
  /** Độ sâu chậu tối thiểu (cm); nếu user khai báo chậu nông hơn → EXCLUDE. */
  min_pot_depth_cm: number;
}

// ============================================================================
// Nhóm 3 — GrowingRules: điều kiện lý tưởng + quy tắc theo vùng (được phép cập nhật)
// ============================================================================

export interface TemperatureRange {
  min: number;
  optimal_min: number;
  optimal_max: number;
  max: number;
}

export interface SunlightHours {
  min: number;
  optimal: number;
}

/** Các giá trị `water` đang dùng trong crops_data.json — engine branch theo "high_tolerates_waterlogged". */
export type WaterNeed =
  | "consistent_moist"
  | "high_tolerates_waterlogged"
  | "moderate_moist"
  | "moderate_moist_well_drained"
  | "high_consistent"
  | "moderate_tolerates_rain"
  | "moderate_consistent";

export interface OptimalConditions {
  temperature_c: TemperatureRange;
  sunlight_hours: SunlightHours;
  water: WaterNeed;
  /** Free-form (vd: "well_draining_loamy_rich") — chưa dùng trong logic engine. */
  soil: string;
}

/**
 * Region key — dynamic per country.
 * Each country defines its own regions in CountryConfig.
 * regional_rules in crop data uses these keys.
 */
export type RegionKey = string;

export interface PlantingWindow {
  months: number[];
  /** VD: "primary" | "late_spring_risky" | "primary_dry_season" | "year_round". Không bắt buộc trong dữ liệu. */
  type?: string;
}

export interface RegionalRule {
  planting_windows: PlantingWindow[];
  /** VD: {"june_july_heatwave": "Avoid. Bolting risk cao."} — engine check được bằng key. */
  local_anomaly_flags: Record<string, string>;
  regional_notes?: string;
  source?: SourceRef;
}

export interface GrowingRules {
  optimal_conditions: OptimalConditions;
  /** Vùng có regional_rules riêng; vùng không có → engine dùng optimal_conditions chung. */
  regional_rules: Record<string, RegionalRule>;
}

// ============================================================================
// Nhóm 4 — BeginnerSuccessFactors: mức độ "tha thứ" cho người mới
// ============================================================================

export type ForgivenessLevel = "low" | "medium" | "high";

export interface BeginnerSuccessFactors {
  forgiveness_overwatering: ForgivenessLevel;
  forgiveness_underwatering: ForgivenessLevel;
  disease_resistance: ForgivenessLevel;
  visibility_of_success: ForgivenessLevel;
  notes?: string;
}

// ============================================================================
// Crop tổng hợp + Dataset
// ============================================================================

export interface Crop {
  crop_base: CropBase;
  hard_constraints: HardConstraints;
  growing_rules: GrowingRules;
  beginner_success_factors: BeginnerSuccessFactors;
}

export interface CropsDataset {
  schema_version: string;
  notes?: string;
  crops: Crop[];
}

// ============================================================================
// RecommendationContext — input của engine (mục 4.3)
// ============================================================================

/** Region is now dynamic per country — use string. */
export type Region = string;
export type LocationType = "window" | "balcony" | "garden";
export type UserGoal = "fastest_harvest" | "daily_food" | "easy_care";
export type UserExperience = "absolute_beginner" | "beginner" | "some_experience";

/** Dữ liệu thời tiết từ provider (dummy hoặc thật ở Phase 2). */
export interface WeatherInfo {
  forecast_temp_max_c?: number;
  forecast_temp_min_c?: number;
  /** VD: "heavy_rain_5days" | "heatwave" ... */
  forecast_condition?: string;
}

export interface RecommendationContext {
  /** Country ID (e.g. "vietnam", "thailand", "indonesia") */
  country: string;
  /** Vùng khí hậu — dynamic per country. Vùng không có regional_rules → engine dùng optimal_conditions chung. */
  region: Region;
  /** Tháng 1-12. */
  month: number;
  /** Proxy micro-climate (mục 5.1): cửa sổ / ban công / sân vườn. */
  location_type: LocationType;
  /** Giờ nắng/ngày user ước lượng. */
  sunlight_hours: number;
  /** Độ sâu chậu (cm). null = trồng đất vườn / chưa biết → không áp hard constraint pot_depth. */
  pot_depth_cm: number | null;
  user_goal?: UserGoal;
  user_experience?: UserExperience;
  /** Override tỷ lệ thất bại cộng đồng (feedback loop, TC14) — KHÔNG phải hard exclude. */
  community_fail_rate_override?: Record<string, number>;
  /**
   * Weather: OPTIONAL — dummy provider trả giá trị trung bình theo mùa ngay từ đầu.
   * Phase 2 chỉ swap provider thật, engine KHÔNG refactor (mục 5.3).
   *
   * Các field forecast_* ở top-level là alias tiện lợi (golden test cases truyền kiểu
   * này, VD: "forecast_temp_max_c": 39); engine merge chúng với `weather` (weather thắng).
   */
  weather?: WeatherInfo;
  forecast_temp_max_c?: number;
  forecast_temp_min_c?: number;
  forecast_condition?: string;
}
