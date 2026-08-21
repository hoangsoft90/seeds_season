/**
 * Country-aware Data Loader — loads crops for a specific country.
 * 
 * Architecture:
 * - Each country has its own crops.json in lib/data/countries/<country>/
 * - This module loads and caches crops per country
 * - The recommendation engine uses getCropsForCountry() instead of getAllCrops()
 */

import type { Crop, CropsDataset } from "../recommendation-engine/types";
import type { CountryId } from "./countries/types";

// Import crop data per country
import vietnamCrops from "./countries/vietnam/crops.json";
import thailandCrops from "./countries/thailand/crops.json";
import indonesiaCrops from "./countries/indonesia/crops.json";
import usaCrops from "./countries/usa/crops.json";
import ukCrops from "./countries/uk/crops.json";

// Registry: countryId → crop dataset
// Note: JSON imports have number[] for tuples — cast through unknown to satisfy TS
const CROP_DATASETS: Record<CountryId, CropsDataset> = {
  vietnam: vietnamCrops as unknown as CropsDataset,
  thailand: thailandCrops as unknown as CropsDataset,
  indonesia: indonesiaCrops as unknown as CropsDataset,
  usa: usaCrops as unknown as CropsDataset,
  uk: ukCrops as unknown as CropsDataset,
};

// Cache for parsed crops
const cropCache: Record<CountryId, Crop[]> = {} as Record<CountryId, Crop[]>;

/**
 * Get all crops for a specific country.
 * Returns empty array if country not found.
 */
export function getCropsForCountry(countryId: string): Crop[] {
  const cid = countryId as CountryId;
  if (cropCache[cid]) return cropCache[cid];

  const dataset = CROP_DATASETS[cid];
  if (!dataset) return [];

  cropCache[cid] = dataset.crops;
  return dataset.crops;
}

/**
 * Get a specific crop by ID within a country.
 */
export function getCropById(countryId: string, cropId: string): Crop | undefined {
  const crops = getCropsForCountry(countryId);
  return crops.find((c) => c.crop_base.id === cropId);
}

/**
 * Get all crops across all countries (for testing/comparison).
 */
export function getAllCropsGlobal(): Crop[] {
  return Object.values(CROP_DATASETS).flatMap((ds) => ds.crops);
}

/**
 * Get supported country IDs that have crop data.
 */
export function getSupportedCropCountryIds(): string[] {
  return Object.keys(CROP_DATASETS);
}
