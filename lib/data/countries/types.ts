/**
 * Country Configuration — defines everything a country needs:
 * - Regions (climate zones)
 * - Seasons (planting calendar)
 * - Language (for UI labels)
 * - Currency (for market price display)
 */

export interface CountryRegion {
  id: string;
  name: string;
  /** Climate classification for recommendation engine */
  climate: "tropical" | "subtropical" | "temperate" | "highland";
}

export interface CountrySeason {
  id: string;
  name: string;
  /** Months when this season occurs (1-12) */
  months: number[];
  /** Typical temperature range for this season */
  temp_range?: { min: number; max: number };
}

export interface CountryConfig {
  /** ISO 3166-1 alpha-2 code */
  id: string;
  /** English name */
  name_en: string;
  /** Local name */
  name_local: string;
  /** Primary language code */
  language: string;
  /** Currency code (for market price display) */
  currency: string;
  /** Currency symbol */
  currency_symbol: string;
  /** Available regions in this country */
  regions: CountryRegion[];
  /** Default region when user hasn't selected one */
  default_region: string;
  /** Seasons for planting calendar */
  seasons: CountrySeason[];
  /** Month names in local language */
  month_names: string[];
}

export type CountryId = "vietnam" | "thailand" | "indonesia";
