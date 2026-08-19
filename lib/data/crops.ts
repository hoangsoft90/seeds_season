/**
 * Data layer — file-based (đủ cho MVP).
 * Migrate sang PostgreSQL (JSON columns cho growing_rules/regional_rules) sau này mà
 * không cần đổi chữ ký hàm — engine chỉ gọi `getAllCrops()`.
 *
 * Nguồn: `crops_data.json` (root). Dữ liệu confidence medium/low cần expert review
 * trước production (ghi chú trong chính file dữ liệu).
 */

import raw from "../../crops_data.json";
import type { Crop, CropsDataset } from "../recommendation-engine/types";

const REQUIRED_GROUPS = [
  "crop_base",
  "hard_constraints",
  "growing_rules",
  "beginner_success_factors",
] as const;

/**
 * Validation cấu trúc tối thiểu: đảm bảo mỗi record có đủ 4 nhóm bắt buộc theo Schema v2.
 * Ném lỗi mô tả rõ record nào hỏng — dùng trong CI để bắt dữ liệu lệch schema sớm.
 */
export function validateDataset(dataset: CropsDataset): void {
  if (!Array.isArray(dataset.crops)) {
    throw new Error("crops_data.json: thiếu mảng 'crops' — sai cấu trúc dataset.");
  }
  dataset.crops.forEach((crop: Crop, idx: number) => {
    const missing = REQUIRED_GROUPS.filter((g) => !(g in crop));
    if (missing.length > 0) {
      throw new Error(
        `crops_data.json: crop #${idx} (id=${(crop.crop_base as { id?: string } | undefined)?.id ?? "?"}) ` +
          `thiếu nhóm bắt buộc: ${missing.join(", ")}. Schema v2 yêu cầu đủ 4 nhóm.`,
      );
    }
  });
}

const dataset = raw as unknown as CropsDataset;

validateDataset(dataset);

/** Toàn bộ cây (đã validate cấu trúc). */
export function getAllCrops(): Crop[] {
  return dataset.crops;
}

/** Tìm cây theo id (vd "cai_xanh"). Trả undefined nếu không có. */
export function getCropById(id: string): Crop | undefined {
  return dataset.crops.find((c) => c.crop_base.id === id);
}

/** Dataset gốc (schema_version, notes, crops). */
export function getDataset(): CropsDataset {
  return dataset;
}
