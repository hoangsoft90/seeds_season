# Tasks: weather-api-swap

## Tasks

- [x] 1. Implement OpenMeteoWeatherProvider trong lib/recommendation-engine/weather.ts (fetch + cache + fallback)
- [x] 2. Wire provider vào /api/recommendations route (fetch async trước khi gọi engine sync)
- [x] 3. UI: Weather data tự động dùng real data khi API available (không cần UI change — resolveWeather ưu tiên context.weather)
- [x] 4. Unit tests: provider + cache + fallback + condition mapping (5 tests)
- [x] 5. Verify: tsc/lint干净, 79/79 test, build OK
