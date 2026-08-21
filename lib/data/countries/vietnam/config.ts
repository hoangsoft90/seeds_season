import type { CountryConfig } from "../types";

export const vietnamConfig: CountryConfig = {
  id: "vietnam",
  name_en: "Vietnam",
  name_local: "Việt Nam",
  language: "vi",
  currency: "VND",
  currency_symbol: "₫",
  regions: [
    { id: "north_vietnam", name: "Miền Bắc", climate: "subtropical" },
    { id: "central_vietnam", name: "Miền Trung", climate: "tropical" },
    { id: "south_vietnam", name: "Miền Nam", climate: "tropical" },
    { id: "highland_vietnam", name: "Vùng cao (Đà Lạt)", climate: "highland" },
  ],
  default_region: "south_vietnam",
  seasons: [
    { id: "spring", name: "Xuân", months: [2, 3, 4] },
    { id: "summer", name: "Hè", months: [5, 6, 7, 8] },
    { id: "autumn", name: "Thu", months: [9, 10, 11] },
    { id: "winter", name: "Đông", months: [12, 1] },
  ],
  month_names: [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
    "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
    "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
  ],
};
