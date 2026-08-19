# Module: Recommendation Engine

Đường dẫn: `lib/recommendation-engine/` — lõi của app, **không phụ thuộc Next.js** (thuần TS, test được bằng vitest).

## Các file

| File | Vai trò |
|---|---|
| `types.ts` | Data Model Schema v2 (CropBase/HardConstraints/GrowingRules/BeginnerSuccessFactors), `Crop`, `CropsDataset`, `RecommendationContext` |
| `engine.ts` | `getRecommendations(ctx, crops, weatherProvider?)` — pipeline + `NO_MATCH_STATE`; output luôn kèm `candidates` + `excluded` (cho audit) |
| `scoring.ts` | Component scorers (season/temp/beginner/fast_harvest/sunspace) + bộ trọng số theo goal/experience |
| `weather.ts` | `WeatherProvider` interface, `DummyWeatherProvider` (bảng nhiệt độ trung bình theo tháng/vùng), `resolveWeather` |
| `audit.ts` | Audit Mode: `formatAudit`/`logAudit` (dev-only) |

## API chính

```ts
getRecommendations(context: RecommendationContext, crops: Crop[], weatherProvider?): RecommendationResult
// RecommendationResult = OkState { status:"ok", recommendations: Recommendation[], candidates, excluded }
//                    | NoMatchState { status:"no_match", message, candidates, excluded }
// Recommendation = { crop, score, components: ComponentScores, role: "easy"|"step_up" }
```

## Pipeline chi tiết

1. **resolveWeather** — `context.weather` ?? field `forecast_*` top-level ?? dummy (theo mùa).
2. **applyHardConstraints** (mỗi cây) — loại nếu:
   - `temp_max > hard_constraints.temp_death_max_c.value`
   - `temp_min < hard_constraints.temp_death_min_c.value`
   - `sunlight_hours < min_sunlight_hours`
   - `pot_depth_cm != null && pot_depth_cm < min_pot_depth_cm`
   - (season KHÔNG hard-exclude)
3. **scoreCrop** — 5 component + trọng số theo `getWeights(ctx)`:
   - `seasonFit`: window match (primary=100, year_round=95, no-type=85, risky=60, ngoài window=20); anomaly flag trùng tháng −35; mưa dầm +15 cho cây chịu ngập; highland fallback = temp fit.
   - `tempOptimalFit`: trung bình (max+min)/2; trong [optimal_min, optimal_max] → 100; lệch về hard edge → 40.
   - `beginnerEase`: 0.4×difficulty + 0.2×(forgiveness over + under + disease).
   - `fastHarvestBonus`: Gaussian đỉnh 30 ngày (mặc định); goal `fastest_harvest` → đơn điệu giảm đỉnh 15 ngày.
   - `sunspaceFit`: 0.7×(hours/optimal) + 0.3×space(location: garden 100/balcony 75/window 45).
   - Modifier: `daily_food` + `single_harvest` → −30; fail-rate override → ×(1−0.8×rate).
4. **selectTop3** — 2 easy đầu + best fruit (step-up) RIÊNG khỏi ranking; không có cây quả → cây easy thứ 3.

## Constants quan trọng

- `NO_MATCH_MESSAGE` (engine.ts) — message mục 5.4.
- `DEFAULT_WEIGHTS` + 4 bộ goal (scoring.ts).
- `WINDOW_TYPE_SCORE`, `LEVEL_SCORE`, `DIFFICULTY_SCORE` (scoring.ts).
- `MONTHLY_TEMPS` (weather.ts) — 3 vùng × 12 tháng.

## Edge cases đã test

- Chậu null (đất vườn) → không áp pot constraint (TC11).
- forecast 39°C loại cây death_max < 39 (TC07).
- 8cm chậu + rét + 1h nắng → NO_MATCH (TC15).
- Mùa hè vs thu-đông cùng vị trí → Top 3 khác hoàn toàn (TC20).
