/**
 * Weather abstraction — mục 5.3 của plan.
 *
 * `RecommendationContext.weather` là OPTIONAL. Khi user không truyền weather (MVP:
 * onboarding chỉ có location + micro-climate), engine dùng `DummyWeatherProvider` —
 * trả giá trị TRUNG BÌNH THEO MÙA theo vùng + tháng. Phase 2 chỉ cần implement
 * `WeatherProvider` bằng API thật và swap vào, engine KHÔNG phải refactor.
 *
 * Multi-country: MONTHLY_TEMPS is now per-country with fallback to tropical default.
 */

import type { RecommendationContext, Region, WeatherInfo } from "./types";

/** Một provider thời tiết bất kỳ (dummy hiện tại, API thật ở Phase 2). */
export interface WeatherProvider {
  getWeather(context: RecommendationContext): WeatherInfo;
}

/** Temperature data per region — { min, max } per month (1-indexed). */
type MonthlyTempData = { min: number; max: number }[];

/** All temperature data organized by country → region. */
const COUNTRY_TEMPS: Record<string, Record<string, MonthlyTempData>> = {
  usa: {
    // Northeast (NY, Boston) — cold winters, warm summers
    northeast: [
      { min: -5, max: 3 }, { min: -3, max: 5 }, { min: 2, max: 10 },
      { min: 7, max: 16 }, { min: 12, max: 22 }, { min: 17, max: 27 },
      { min: 20, max: 30 }, { min: 19, max: 29 }, { min: 15, max: 25 },
      { min: 9, max: 18 }, { min: 4, max: 12 }, { min: -2, max: 5 },
    ],
    // Southeast (Atlanta, Miami) — mild winters, hot summers
    southeast: [
      { min: 5, max: 15 }, { min: 7, max: 17 }, { min: 10, max: 21 },
      { min: 14, max: 25 }, { min: 18, max: 29 }, { min: 22, max: 32 },
      { min: 23, max: 33 }, { min: 23, max: 33 }, { min: 21, max: 31 },
      { min: 15, max: 26 }, { min: 10, max: 21 }, { min: 6, max: 16 },
    ],
    // Midwest (Chicago) — extreme winters, hot summers
    midwest: [
      { min: -8, max: -1 }, { min: -6, max: 2 }, { min: 0, max: 9 },
      { min: 6, max: 16 }, { min: 12, max: 22 }, { min: 17, max: 28 },
      { min: 19, max: 30 }, { min: 18, max: 29 }, { min: 14, max: 25 },
      { min: 8, max: 17 }, { min: 2, max: 10 }, { min: -5, max: 1 },
    ],
    // West Coast (LA, SF, Seattle) — mild, less variation
    west_coast: [
      { min: 8, max: 18 }, { min: 9, max: 19 }, { min: 10, max: 20 },
      { min: 11, max: 22 }, { min: 13, max: 24 }, { min: 15, max: 27 },
      { min: 17, max: 30 }, { min: 17, max: 30 }, { min: 16, max: 28 },
      { min: 13, max: 24 }, { min: 10, max: 20 }, { min: 8, max: 18 },
    ],
    // Mountain (Denver) — dry, extreme temp swings
    mountain: [
      { min: -7, max: 7 }, { min: -5, max: 10 }, { min: -1, max: 14 },
      { min: 4, max: 19 }, { min: 9, max: 24 }, { min: 14, max: 30 },
      { min: 17, max: 32 }, { min: 16, max: 31 }, { min: 11, max: 27 },
      { min: 5, max: 20 }, { min: -2, max: 12 }, { min: -7, max: 6 },
    ],
  },
  uk: {
    // South England (London) — mildest in UK
    south_england: [
      { min: 2, max: 8 }, { min: 2, max: 8 }, { min: 4, max: 11 },
      { min: 6, max: 14 }, { min: 9, max: 17 }, { min: 12, max: 20 },
      { min: 14, max: 23 }, { min: 14, max: 22 }, { min: 11, max: 19 },
      { min: 8, max: 15 }, { min: 5, max: 11 }, { min: 3, max: 8 },
    ],
    // North England (Manchester) — cooler
    north_england: [
      { min: 1, max: 6 }, { min: 1, max: 7 }, { min: 2, max: 9 },
      { min: 4, max: 12 }, { min: 7, max: 15 }, { min: 10, max: 18 },
      { min: 12, max: 20 }, { min: 12, max: 20 }, { min: 10, max: 17 },
      { min: 7, max: 13 }, { min: 4, max: 9 }, { min: 2, max: 7 },
    ],
    // Scotland (Edinburgh) — coldest in UK
    scotland: [
      { min: 0, max: 5 }, { min: 0, max: 6 }, { min: 1, max: 8 },
      { min: 3, max: 11 }, { min: 6, max: 14 }, { min: 9, max: 16 },
      { min: 11, max: 18 }, { min: 11, max: 18 }, { min: 9, max: 16 },
      { min: 6, max: 12 }, { min: 3, max: 8 }, { min: 1, max: 5 },
    ],
    // Wales (Cardiff) — similar to south but wetter
    wales: [
      { min: 2, max: 7 }, { min: 2, max: 7 }, { min: 3, max: 10 },
      { min: 5, max: 13 }, { min: 8, max: 16 }, { min: 11, max: 19 },
      { min: 13, max: 21 }, { min: 13, max: 21 }, { min: 11, max: 18 },
      { min: 8, max: 14 }, { min: 5, max: 10 }, { min: 3, max: 8 },
    ],
  },
  vietnam: {
    // Miền Bắc (Hà Nội): đông rét ~13°C, hè nóng ~33-34°C
    north_vietnam: [
      { min: 13, max: 19 }, { min: 15, max: 21 }, { min: 18, max: 24 },
      { min: 21, max: 28 }, { min: 23, max: 31 }, { min: 25, max: 33 },
      { min: 26, max: 34 }, { min: 25, max: 33 }, { min: 24, max: 31 },
      { min: 21, max: 28 }, { min: 17, max: 25 }, { min: 14, max: 21 },
    ],
    // Miền Nam (TP.HCM): nóng quanh năm
    south_vietnam: [
      { min: 23, max: 31 }, { min: 23, max: 31 }, { min: 23, max: 31 },
      { min: 23, max: 31 }, { min: 24, max: 32 }, { min: 24, max: 32 },
      { min: 24, max: 32 }, { min: 24, max: 32 }, { min: 24, max: 32 },
      { min: 24, max: 32 }, { min: 24, max: 32 }, { min: 23, max: 31 },
    ],
    // Vùng cao (Đà Lạt)
    highland_vietnam: [
      { min: 13, max: 24 }, { min: 14, max: 25 }, { min: 15, max: 26 },
      { min: 16, max: 27 }, { min: 17, max: 27 }, { min: 17, max: 26 },
      { min: 17, max: 26 }, { min: 17, max: 26 }, { min: 16, max: 26 },
      { min: 15, max: 25 }, { min: 14, max: 24 }, { min: 13, max: 23 },
    ],
    central_vietnam: [
      { min: 18, max: 24 }, { min: 19, max: 26 }, { min: 21, max: 28 },
      { min: 24, max: 30 }, { min: 26, max: 33 }, { min: 27, max: 34 },
      { min: 27, max: 34 }, { min: 27, max: 34 }, { min: 26, max: 32 },
      { min: 24, max: 30 }, { min: 21, max: 26 }, { min: 19, max: 23 },
    ],
  },
  thailand: {
    // Bangkok area — hot year-round
    central_thailand: [
      { min: 21, max: 32 }, { min: 23, max: 33 }, { min: 25, max: 35 },
      { min: 26, max: 36 }, { min: 26, max: 35 }, { min: 26, max: 34 },
      { min: 25, max: 33 }, { min: 25, max: 33 }, { min: 25, max: 33 },
      { min: 24, max: 32 }, { min: 22, max: 31 }, { min: 20, max: 30 },
    ],
    // Chiang Mai area — cooler in winter
    north_thailand: [
      { min: 15, max: 28 }, { min: 17, max: 30 }, { min: 20, max: 33 },
      { min: 23, max: 35 }, { min: 24, max: 34 }, { min: 24, max: 32 },
      { min: 23, max: 31 }, { min: 23, max: 31 }, { min: 23, max: 31 },
      { min: 22, max: 30 }, { min: 19, max: 28 }, { min: 16, max: 27 },
    ],
    // Isan — hot and dry
    northeast_thailand: [
      { min: 16, max: 30 }, { min: 19, max: 32 }, { min: 22, max: 35 },
      { min: 24, max: 36 }, { min: 24, max: 35 }, { min: 24, max: 34 },
      { min: 23, max: 33 }, { min: 23, max: 32 }, { min: 23, max: 32 },
      { min: 22, max: 31 }, { min: 19, max: 30 }, { min: 16, max: 29 },
    ],
    // South — humid, less variation
    south_thailand: [
      { min: 23, max: 31 }, { min: 23, max: 32 }, { min: 24, max: 33 },
      { min: 25, max: 33 }, { min: 25, max: 33 }, { min: 25, max: 32 },
      { min: 24, max: 32 }, { min: 24, max: 32 }, { min: 24, max: 32 },
      { min: 24, max: 31 }, { min: 23, max: 31 }, { min: 23, max: 31 },
    ],
  },
  indonesia: {
    // Java — tropical, wet/dry seasons
    java: [
      { min: 24, max: 30 }, { min: 24, max: 30 }, { min: 24, max: 31 },
      { min: 24, max: 32 }, { min: 24, max: 32 }, { min: 23, max: 32 },
      { min: 23, max: 32 }, { min: 23, max: 32 }, { min: 24, max: 32 },
      { min: 24, max: 32 }, { min: 24, max: 31 }, { min: 24, max: 30 },
    ],
    // Sumatra — similar to Java
    sumatra: [
      { min: 23, max: 31 }, { min: 23, max: 31 }, { min: 23, max: 32 },
      { min: 24, max: 33 }, { min: 24, max: 33 }, { min: 23, max: 33 },
      { min: 23, max: 33 }, { min: 23, max: 33 }, { min: 23, max: 32 },
      { min: 23, max: 32 }, { min: 23, max: 31 }, { min: 23, max: 31 },
    ],
    // Bali — slightly cooler due to elevation
    bali: [
      { min: 23, max: 30 }, { min: 23, max: 30 }, { min: 23, max: 31 },
      { min: 23, max: 32 }, { min: 23, max: 32 }, { min: 22, max: 31 },
      { min: 22, max: 31 }, { min: 22, max: 31 }, { min: 23, max: 31 },
      { min: 23, max: 31 }, { min: 23, max: 30 }, { min: 23, max: 30 },
    ],
    // Kalimantan — hot and humid
    kalimantan: [
      { min: 24, max: 30 }, { min: 24, max: 31 }, { min: 24, max: 32 },
      { min: 24, max: 33 }, { min: 25, max: 33 }, { min: 24, max: 33 },
      { min: 24, max: 33 }, { min: 24, max: 33 }, { min: 24, max: 32 },
      { min: 24, max: 32 }, { min: 24, max: 31 }, { min: 24, max: 30 },
    ],
  },
};

/** Default tropical temperatures for unknown regions. */
const TROPICAL_DEFAULT: MonthlyTempData = [
  { min: 24, max: 31 }, { min: 24, max: 31 }, { min: 24, max: 32 },
  { min: 24, max: 33 }, { min: 24, max: 33 }, { min: 24, max: 33 },
  { min: 24, max: 33 }, { min: 24, max: 33 }, { min: 24, max: 32 },
  { min: 24, max: 32 }, { min: 24, max: 31 }, { min: 24, max: 31 },
];

/**
 * Dummy provider — trả nhiệt độ trung bình theo mùa của vùng + tháng.
 * Multi-country: looks up by country → region, falls back to tropical default.
 */
export class DummyWeatherProvider implements WeatherProvider {
  getWeather(context: RecommendationContext): WeatherInfo {
    const month = clampMonth(context.month);
    const countryTemps = COUNTRY_TEMPS[context.country ?? "vietnam"];
    const regionTemps = countryTemps?.[context.region] ?? TROPICAL_DEFAULT;
    const t = regionTemps[month - 1] ?? TROPICAL_DEFAULT[month - 1];
    return {
      forecast_temp_max_c: t.max,
      forecast_temp_min_c: t.min,
      forecast_condition: undefined,
    };
  }
}

function clampMonth(month: number): number {
  if (!Number.isFinite(month)) return 1;
  return Math.min(12, Math.max(1, Math.round(month)));
}

// ── Open-Meteo real weather provider (Phase 2) ──────────────────────────

/** Tọa độ thành phố dùng cho Open-Meteo API (multi-country). */
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  // Vietnam
  north_vietnam: { lat: 21.0285, lng: 105.8542 },   // Hà Nội
  south_vietnam: { lat: 10.8231, lng: 106.6297 },   // TP.HCM
  highland_vietnam: { lat: 11.9465, lng: 108.4419 }, // Đà Lạt
  // Thailand
  central_thailand: { lat: 13.7563, lng: 100.5018 },  // Bangkok
  north_thailand: { lat: 18.7883, lng: 98.9853 },     // Chiang Mai
  northeast_thailand: { lat: 16.4322, lng: 102.8236 }, // Khon Kaen
  south_thailand: { lat: 7.8804, lng: 98.3923 },      // Phuket
  // Indonesia
  java: { lat: -6.2088, lng: 106.8456 },    // Jakarta
  sumatra: { lat: -2.9761, lng: 104.7754 }, // Palembang
  bali: { lat: -8.3405, lng: 115.0920 },    // Denpasar
  kalimantan: { lat: -0.5071, lng: 117.1535 }, // Samarinda
  // USA
  northeast: { lat: 40.7128, lng: -74.0060 },   // New York
  southeast: { lat: 33.7490, lng: -84.3880 },    // Atlanta
  midwest: { lat: 41.8781, lng: -87.6298 },     // Chicago
  west_coast: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
  mountain: { lat: 39.7392, lng: -104.9903 },   // Denver
  // UK
  south_england: { lat: 51.5074, lng: -0.1278 },  // London
  north_england: { lat: 53.4808, lng: -2.2426 },  // Manchester
  scotland: { lat: 55.9533, lng: -3.1883 },       // Edinburgh
  wales: { lat: 51.4816, lng: -3.1791 },          // Cardiff
};

/** Weather code từ Open-Meteo → condition string. */
function mapCondition(code: number | undefined): string | undefined {
  if (code === undefined) return undefined;
  if (code <= 1) return "clear";
  if (code <= 3) return "cloudy";
  if (code <= 49) return "fog";
  if (code <= 69) return "rain";
  if (code <= 79) return "snow";
  if (code <= 99) return "rain"; // thunderstorm
  return undefined;
}

/** In-memory cache với TTL 1 giờ. */
interface CacheEntry {
  data: WeatherInfo;
  timestamp: number;
}
const weatherCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function cacheKey(region: Region, month: number): string {
  return `${region}:${month}`;
}

function getCached(region: Region, month: number): WeatherInfo | null {
  const key = cacheKey(region, month);
  const entry = weatherCache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.data;
  }
  weatherCache.delete(key);
  return null;
}

function setCache(region: Region, month: number, data: WeatherInfo): void {
  const key = cacheKey(region, month);
  weatherCache.set(key, { data, timestamp: Date.now() });
}

/**
 * Open-Meteo provider — gọi API thật, trả nhiệt độ thực tế.
 * Free tier: 10,000 requests/day, không cần API key.
 * Docs: https://open-meteo.com/en/docs
 */
export class OpenMeteoWeatherProvider {
  private dummy = new DummyWeatherProvider();

  async getWeather(context: RecommendationContext): Promise<WeatherInfo> {
    const month = clampMonth(context.month);

    // Check cache
    const cached = getCached(context.region, month);
    if (cached) return cached;

    const coords = CITY_COORDS[context.region];
    if (!coords) return this.dummy.getWeather(context);
    // Note: OpenMeteo is free, no API key needed. Works for any coordinates globally.

    try {
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${coords.lat}&longitude=${coords.lng}` +
        `&daily=temperature_2m_max,temperature_2m_min,weathercode` +
        `&timezone=auto&forecast_days=1`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);

      const data = (await res.json()) as {
        daily?: { temperature_2m_max?: number[]; temperature_2m_min?: number[]; weathercode?: number[] };
      };

      const max = data.daily?.temperature_2m_max?.[0];
      const min = data.daily?.temperature_2m_min?.[0];
      const code = data.daily?.weathercode?.[0];

      if (max === undefined || min === undefined) throw new Error("Invalid Open-Meteo response");

      const weather: WeatherInfo = {
        forecast_temp_max_c: max,
        forecast_temp_min_c: min,
        forecast_condition: mapCondition(code),
      };

      setCache(context.region, month, weather);
      return weather;
    } catch {
      // Fallback to dummy on any error (timeout, network, parse)
      return this.dummy.getWeather(context);
    }
  }
}

/** Kiểm tra xem có API key nào cho weather provider không. */
export function hasWeatherApiKey(): boolean {
  // Open-Meteo không cần key; function reserved cho future provider cần key
  return false;
}

/** Clear cache — dùng cho test. */
export function clearWeatherCache(): void {
  weatherCache.clear();
}

/**
 * Quyết định dữ liệu weather dùng cho 1 request:
 * ưu tiên context.weather → các field forecast_* ở top-level context (test cases
 * truyền kiểu này) → dummy provider. Kết quả luôn có max/min (dummy nếu thiếu).
 */
export function resolveWeather(
  context: RecommendationContext,
  provider: WeatherProvider = new DummyWeatherProvider(),
): Required<Pick<WeatherInfo, "forecast_temp_max_c" | "forecast_temp_min_c">> & WeatherInfo {
  const fromContext = context.weather ?? {};
  const dummy = provider.getWeather(context);

  const forecast_temp_max_c =
    fromContext.forecast_temp_max_c ?? context.forecast_temp_max_c ?? dummy.forecast_temp_max_c;
  const forecast_temp_min_c =
    fromContext.forecast_temp_min_c ?? context.forecast_temp_min_c ?? dummy.forecast_temp_min_c;
  const forecast_condition =
    fromContext.forecast_condition ?? context.forecast_condition ?? dummy.forecast_condition;

  return {
    forecast_temp_max_c: forecast_temp_max_c ?? 30,
    forecast_temp_min_c: forecast_temp_min_c ?? 20,
    forecast_condition,
  };
}
