import type { CountryConfig } from "../types";

export const ukConfig: CountryConfig = {
  id: "uk",
  name_en: "United Kingdom",
  name_local: "United Kingdom",
  language: "en",
  currency: "GBP",
  currency_symbol: "£",
  regions: [
    { id: "south_england", name: "South England (London)", climate: "temperate" },
    { id: "north_england", name: "North England (Manchester)", climate: "temperate" },
    { id: "scotland", name: "Scotland (Edinburgh)", climate: "temperate" },
    { id: "wales", name: "Wales (Cardiff)", climate: "temperate" },
  ],
  default_region: "south_england",
  seasons: [
    { id: "spring", name: "Spring", months: [3, 4, 5], temp_range: { min: 5, max: 18 } },
    { id: "summer", name: "Summer", months: [6, 7, 8], temp_range: { min: 12, max: 25 } },
    { id: "autumn", name: "Autumn", months: [9, 10, 11], temp_range: { min: 5, max: 18 } },
    { id: "winter", name: "Winter", months: [12, 1, 2], temp_range: { min: -2, max: 8 } },
  ],
  month_names: [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December",
  ],
};
