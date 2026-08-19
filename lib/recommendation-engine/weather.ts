/**
 * Weather abstraction — mục 5.3 của plan.
 *
 * `RecommendationContext.weather` là OPTIONAL. Khi user không truyền weather (MVP:
 * onboarding chỉ có location + micro-climate), engine dùng `DummyWeatherProvider` —
 * trả giá trị TRUNG BÌNH THEO MÙA theo vùng + tháng. Phase 2 chỉ cần implement
 * `WeatherProvider` bằng API thật và swap vào, engine KHÔNG phải refactor.
 */

import type { RecommendationContext, Region, WeatherInfo } from "./types";

/** Một provider thời tiết bất kỳ (dummy hiện tại, API thật ở Phase 2). */
export interface WeatherProvider {
  getWeather(context: RecommendationContext): WeatherInfo;
}

/** Nhiệt độ trung bình theo tháng (min/max, °C) cho từng vùng khí hậu — giá trị tham khảo khí hậu VN. */
const MONTHLY_TEMPS: Record<Region, { min: number; max: number }[]> = {
  // Miền Bắc (Hà Nội): đông rét ~13°C, hè nóng ~33-34°C
  north_vietnam: [
    { min: 13, max: 19 }, // T1
    { min: 15, max: 21 }, // T2
    { min: 18, max: 24 }, // T3
    { min: 21, max: 28 }, // T4
    { min: 23, max: 31 }, // T5
    { min: 25, max: 33 }, // T6
    { min: 26, max: 34 }, // T7
    { min: 25, max: 33 }, // T8
    { min: 24, max: 31 }, // T9
    { min: 21, max: 28 }, // T10
    { min: 17, max: 25 }, // T11
    { min: 14, max: 21 }, // T12
  ],
  // Miền Nam (TP.HCM): nóng quanh năm; mùa khô (12-4) dịu hơn mùa mưa (5-11) một chút
  south_vietnam: [
    { min: 23, max: 31 }, // T1
    { min: 23, max: 31 }, // T2
    { min: 23, max: 31 }, // T3
    { min: 23, max: 31 }, // T4
    { min: 24, max: 32 }, // T5
    { min: 24, max: 32 }, // T6
    { min: 24, max: 32 }, // T7
    { min: 24, max: 32 }, // T8
    { min: 24, max: 32 }, // T9
    { min: 24, max: 32 }, // T10
    { min: 24, max: 32 }, // T11
    { min: 23, max: 31 }, // T12
  ],
  // Vùng cao (Đà Lạt): mát quanh năm, không có mùa nóng gắt
  highland_vietnam: [
    { min: 13, max: 24 }, // T1
    { min: 14, max: 25 }, // T2
    { min: 15, max: 26 }, // T3
    { min: 16, max: 27 }, // T4
    { min: 17, max: 27 }, // T5
    { min: 17, max: 26 }, // T6
    { min: 17, max: 26 }, // T7
    { min: 17, max: 26 }, // T8
    { min: 16, max: 26 }, // T9
    { min: 15, max: 25 }, // T10
    { min: 14, max: 24 }, // T11
    { min: 13, max: 23 }, // T12
  ],
};

/**
 * Dummy provider — trả nhiệt độ trung bình theo mùa của vùng + tháng.
 * Chỉ để engine chạy được ngay từ Phase 1; KHÔNG phải dự báo thật.
 */
export class DummyWeatherProvider implements WeatherProvider {
  getWeather(context: RecommendationContext): WeatherInfo {
    const month = clampMonth(context.month);
    const t = MONTHLY_TEMPS[context.region]?.[month - 1] ?? MONTHLY_TEMPS.north_vietnam[month - 1];
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

/** Tọa độ thành phố VN dùng cho Open-Meteo API (chỉ khi user chọn city cụ thể). */
const CITY_COORDS: Record<Region, { lat: number; lng: number }> = {
  north_vietnam: { lat: 21.0285, lng: 105.8542 },   // Hà Nội
  south_vietnam: { lat: 10.8231, lng: 106.6297 },   // TP.HCM
  highland_vietnam: { lat: 11.9465, lng: 108.4419 }, // Đà Lạt
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
