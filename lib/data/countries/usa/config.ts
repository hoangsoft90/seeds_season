import type { CountryConfig } from "../types";

export const usaConfig: CountryConfig = {
  id: "usa",
  name_en: "United States",
  name_local: "United States",
  language: "en",
  currency: "USD",
  currency_symbol: "$",
  regions: [
    { id: "northeast", name: "Northeast (NY, Boston)", climate: "temperate" },
    { id: "southeast", name: "Southeast (Atlanta, Miami)", climate: "subtropical" },
    { id: "midwest", name: "Midwest (Chicago, Detroit)", climate: "temperate" },
    { id: "west_coast", name: "West Coast (LA, SF, Seattle)", climate: "subtropical" },
    { id: "mountain", name: "Mountain (Denver, Salt Lake)", climate: "temperate" },
  ],
  default_region: "northeast",
  seasons: [
    { id: "spring", name: "Spring", months: [3, 4, 5], temp_range: { min: 5, max: 22 } },
    { id: "summer", name: "Summer", months: [6, 7, 8], temp_range: { min: 18, max: 35 } },
    { id: "fall", name: "Fall", months: [9, 10, 11], temp_range: { min: 5, max: 22 } },
    { id: "winter", name: "Winter", months: [12, 1, 2], temp_range: { min: -10, max: 8 } },
  ],
  month_names: [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
  ],
};
