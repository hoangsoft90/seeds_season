# Design: weather-api-swap

## Architecture

```
API Route (/api/recommendations)
    │
    ▼
resolveWeather(context, provider)
    │
    ├── context.weather exists? → use it (test override)
    │
    ├── context has city coordinates? → OpenMeteoWeatherProvider
    │       │
    │       ├── cache hit (< 1h) → cached WeatherInfo
    │       │
    │       ├── API success → cache + return WeatherInfo
    │       │
    │       └── API fail/timeout → DummyWeatherProvider fallback
    │
    └── no city? → DummyWeatherProvider (as before)
```

## Open-Meteo API
- Endpoint: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lng}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`
- Free, no API key, 10,000 requests/day
- Returns daily forecast — we take today's values

## City Coordinates
Map region → city coordinates (Hanoi, HCMC, Dalat). Only used when user selects a specific city (not GPS).

```typescript
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  north_vietnam: { lat: 21.0285, lng: 105.8542 },   // Hanoi
  south_vietnam: { lat: 10.8231, lng: 106.6297 },   // HCMC
  highland_vietnam: { lat: 11.9465, lng: 108.4419 }, // Dalat
};
```

## Caching
Simple in-memory cache with TTL (1 hour). No external cache service needed for MVP.

```typescript
const cache = new Map<string, { data: WeatherInfo; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
```

## Files
- `lib/recommendation-engine/weather.ts` — add `OpenMeteoWeatherProvider` class
- `app/api/recommendations/route.ts` — wire provider
- `tests/weather.test.ts` — test provider + cache + fallback
