/**
 * My Garden — data model (change my-garden, plan mục 6 Phase 1.5).
 *
 * Nguyên tắc cốt lõi: KHÔNG BAO GIỜ xoá vật lý bản ghi cây đã trồng.
 * Khi cây chết / bỏ theo dõi → chuyển sang trạng thái "ghost" lưu `died_at` + `cause`.
 * Đây là nguồn Data Moat: lịch sử thất bại cá nhân hoá cho gợi ý "lần trước thất bại vì X, thử Y".
 */

/** 4 nguyên nhân chết chọn nhanh (key tiếng Anh, label tiếng Việt ở lib/labels.ts). */
export type GhostCause = "sun_heat" | "pest" | "waterlogged" | "unknown";

export type GardenStatus = "growing" | "ghost" | "harvested";

/** Một cây trong vườn của user. */
export interface GardenPlant {
  id: string;
  user_id: string;
  crop_id: string;
  /** ISO datetime — ngày bắt đầu trồng. */
  planted_at: string;
  status: GardenStatus;
  /** ISO datetime — chỉ có khi status = ghost. */
  died_at?: string;
  /** Chỉ có khi status = ghost. */
  cause?: GhostCause;
  /** ISO datetime — chỉ có khi status = harvested. */
  harvested_at?: string;
}

/** Lỗi khi user đã có cây đang trồng cùng crop_id (thêm trùng). */
export class DuplicateCropError extends Error {
  constructor(cropId: string) {
    super(`Cây '${cropId}' đã có trong vườn của bạn.`);
    this.name = "DuplicateCropError";
  }
}
