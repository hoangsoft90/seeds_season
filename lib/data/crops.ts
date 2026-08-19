/**
 * Crop data loader — import crops_data.json and provide typed access.
 */
import type { Crop, CropsDataset } from "../recommendation-engine/types";
import cropsDataJson from "./crops_data.json";

const dataset = cropsDataJson as CropsDataset;

/** All crops loaded from JSON data. */
export const ALL_CROPS: Crop[] = dataset.crops;

/** Get all crops (for tests + engine). */
export function getAllCrops(): Crop[] {
  return ALL_CROPS;
}

/** Get a single crop by ID. */
export function getCropById(id: string): Crop | undefined {
  return ALL_CROPS.find((c) => c.crop_base.id === id);
}
