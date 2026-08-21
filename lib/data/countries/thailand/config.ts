import type { CountryConfig } from "../types";

export const thailandConfig: CountryConfig = {
  id: "thailand",
  name_en: "Thailand",
  name_local: "ประเทศไทย",
  language: "th",
  currency: "THB",
  currency_symbol: "฿",
  regions: [
    { id: "central_thailand", name: "Central (Bangkok)", climate: "tropical" },
    { id: "northeast_thailand", name: "Isan (Northeast)", climate: "tropical" },
    { id: "north_thailand", name: "North (Chiang Mai)", climate: "subtropical" },
    { id: "south_thailand", name: "South (Phuket)", climate: "tropical" },
  ],
  default_region: "central_thailand",
  seasons: [
    { id: "cool_season", name: "Cool Season", months: [11, 12, 1, 2], temp_range: { min: 18, max: 30 } },
    { id: "hot_season", name: "Hot Season", months: [3, 4, 5], temp_range: { min: 30, max: 40 } },
    { id: "rainy_season", name: "Rainy Season", months: [6, 7, 8, 9, 10], temp_range: { min: 24, max: 33 } },
  ],
  month_names: [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
    "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
    "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
  ],
};
