/**
 * Unit test cho OpenMeteoWeatherProvider (change weather-api-swap).
 *
 * Kiểm tra: cache, fallback, condition mapping.
 * Không test API thật (network-dependent) — test logic cache + fallback + mapping.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { clearWeatherCache } from "../lib/recommendation-engine/weather";
import type { RecommendationContext } from "../lib/recommendation-engine/types";

// Mock fetch để không gọi API thật
const mockFetch = (response: unknown, ok = true) => {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(response),
  }) as never;
};

const BASE_CTX: RecommendationContext = {
  region: "north_vietnam",
  month: 8,
  location_type: "balcony",
  sunlight_hours: 4,
  pot_depth_cm: 20,
};

beforeEach(() => {
  clearWeatherCache();
  vi.restoreAllMocks();
});

describe("OpenMeteoWeatherProvider", () => {
  it("returns real weather data from API", async () => {
    mockFetch({
      daily: {
        temperature_2m_max: [35.2],
        temperature_2m_min: [26.1],
        weathercode: [0],
      },
    });

    const { OpenMeteoWeatherProvider } = await import("../lib/recommendation-engine/weather");
    const provider = new OpenMeteoWeatherProvider();
    const weather = await provider.getWeather(BASE_CTX);

    expect(weather.forecast_temp_max_c).toBe(35.2);
    expect(weather.forecast_temp_min_c).toBe(26.1);
    expect(weather.forecast_condition).toBe("clear");
  });

  it("falls back to dummy on API error", async () => {
    mockFetch(null, false); // HTTP error

    const { OpenMeteoWeatherProvider } = await import("../lib/recommendation-engine/weather");
    const provider = new OpenMeteoWeatherProvider();
    const weather = await provider.getWeather(BASE_CTX);

    // Dummy returns monthly average for north_vietnam August: max 33, min 25
    expect(weather.forecast_temp_max_c).toBe(33);
    expect(weather.forecast_temp_min_c).toBe(25);
  });

  it("falls back to dummy on network timeout", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("AbortError")) as never;

    const { OpenMeteoWeatherProvider } = await import("../lib/recommendation-engine/weather");
    const provider = new OpenMeteoWeatherProvider();
    const weather = await provider.getWeather(BASE_CTX);

    expect(weather.forecast_temp_max_c).toBe(33); // dummy value
  });

  it("caches response for same region+month", async () => {
    mockFetch({
      daily: {
        temperature_2m_max: [35.2],
        temperature_2m_min: [26.1],
        weathercode: [0],
      },
    });

    const { OpenMeteoWeatherProvider } = await import("../lib/recommendation-engine/weather");
    const provider = new OpenMeteoWeatherProvider();

    await provider.getWeather(BASE_CTX);
    await provider.getWeather(BASE_CTX);

    // fetch should only be called once (second uses cache)
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
});

describe("weather condition mapping", () => {
  it("maps weather codes correctly", async () => {
    // Test by importing the module and checking condition mapping
    // We test indirectly through the provider
    const testCases = [
      { code: 0, expected: "clear" },
      { code: 2, expected: "cloudy" },
      { code: 51, expected: "rain" },
    ];

    for (const { code, expected } of testCases) {
      mockFetch({
        daily: {
          temperature_2m_max: [30],
          temperature_2m_min: [20],
          weathercode: [code],
        },
      });

      clearWeatherCache();
      const { OpenMeteoWeatherProvider } = await import("../lib/recommendation-engine/weather");
      const provider = new OpenMeteoWeatherProvider();
      const weather = await provider.getWeather(BASE_CTX);
      expect(weather.forecast_condition).toBe(expected);
    }
  });
});
