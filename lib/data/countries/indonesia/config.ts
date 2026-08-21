import type { CountryConfig } from "../types";

export const indonesiaConfig: CountryConfig = {
  id: "indonesia",
  name_en: "Indonesia",
  name_local: "Indonesia",
  language: "id",
  currency: "IDR",
  currency_symbol: "Rp",
  regions: [
    { id: "java", name: "Java", climate: "tropical" },
    { id: "sumatra", name: "Sumatra", climate: "tropical" },
    { id: "bali", name: "Bali", climate: "tropical" },
    { id: "kalimantan", name: "Kalimantan", climate: "tropical" },
  ],
  default_region: "java",
  seasons: [
    { id: "dry_season", name: "Dry Season", months: [4, 5, 6, 7, 8, 9, 10], temp_range: { min: 23, max: 35 } },
    { id: "wet_season", name: "Wet Season", months: [11, 12, 1, 2, 3], temp_range: { min: 24, max: 33 } },
  ],
  month_names: [
    "Januari", "Februari", "Maret", "April",
    "Mei", "Juni", "Juli", "Agustus",
    "September", "Oktober", "November", "Desember",
  ],
};
