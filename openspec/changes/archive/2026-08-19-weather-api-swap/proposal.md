# Proposal: weather-api-swap

## Status
**active** — ready for implementation

## Summary
Swap `DummyWeatherProvider` (nhiệt độ trung bình theo mùa) sang Open-Meteo API thật — free, không cần API key, có dữ liệu cho Việt Nam. Engine đã chuẩn bị interface `WeatherProvider` từ Phase 1 nên chỉ cần implement provider mới + wire vào API route.

## Motivation
Plan mục 7: "Tích hợp weather API thật (swap dummy provider đã chuẩn bị từ Phase 1)." Nhiệt độ thực tế khác biệt đáng kể so với trung bình mùa (VD: Hà Nội T8 có ngày 38°C thay vì trung bình 33°C → hard constraint cần loại cà chua bi chính xác hơn).

## Scope
- **In scope:**
  - `OpenMeteoWeatherProvider` implement `WeatherProvider` interface
  - Gọi Open-Meteo API (free, no key) với lat/lng từ city coordinates
  - Cache kết quả 1 giờ (tránh gọi API mỗi request)
  - Fallback về DummyWeatherProvider khi API fail
  - Wire vào `/api/recommendations` route
  - UI hiển thị "Dựa trên dự báo thời tiết thực tế" khi dùng weather thật

- **Out of scope:**
  - Weather forecast UI chi tiết (chart, daily breakdown)
  - Push notification khi thời tiết thay đổi
  - Weather history / analytics

## Requirements
1. **R1:** Provider mới trả WeatherInfo từ Open-Meteo API (temperature min/max, condition)
2. **R2:** Fallback về DummyWeatherProvider khi API timeout/fail
3. **R3:** Cache 1 giờ để tránh rate limit
4. **R4:** API route dùng provider mới khi có city coordinates
5. **R5:** 21+ golden tests vẫn pass (engine không đổi, chỉ data khác)

## Dependencies
- `WeatherProvider` interface (đã có)
- Open-Meteo API (free, no key): https://open-meteo.com
