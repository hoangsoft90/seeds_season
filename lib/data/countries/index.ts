/**
 * Country Registry — single source of truth for all supported countries.
 * 
 * To add a new country:
 * 1. Create lib/data/countries/<country>/config.ts
 * 2. Create lib/data/countries/<country>/crops.json
 * 3. Import and register here
 */

import type { CountryConfig, CountryId } from "./types";
import { vietnamConfig } from "./vietnam/config";
import { thailandConfig } from "./thailand/config";
import { indonesiaConfig } from "./indonesia/config";
import { usaConfig } from "./usa/config";
import { ukConfig } from "./uk/config";

const countryConfigs: Record<CountryId, CountryConfig> = {
  vietnam: vietnamConfig,
  thailand: thailandConfig,
  indonesia: indonesiaConfig,
  usa: usaConfig,
  uk: ukConfig,
};

/** Get config for a specific country */
export function getCountryConfig(countryId: string): CountryConfig | undefined {
  return countryConfigs[countryId as CountryId];
}

/** Get all supported countries */
export function getAllCountries(): CountryConfig[] {
  return Object.values(countryConfigs);
}

/** Get all supported country IDs */
export function getSupportedCountryIds(): CountryId[] {
  return Object.keys(countryConfigs) as CountryId[];
}

export type { CountryConfig, CountryId };
export { vietnamConfig, thailandConfig, indonesiaConfig };
