# Architecture

## Sơ đồ tổng quan

```
Browser (mobile-first, PWA-ready)
   │  fetch POST /api/recommendations
   ▼
app/api/recommendations/route.ts        ← validate input → engine → JSON (Top 3 + Why)
   │
   ▼
lib/recommendation-engine/
   ├── engine.ts    getRecommendations(ctx, crops, weatherProvider?)
   ├── scoring.ts   component scorers + bộ trọng số theo goal
   ├── weather.ts   WeatherProvider interface + DummyWeatherProvider (theo mùa)
   ├── types.ts     Data Model Schema v2 + RecommendationContext
   └── audit.ts     Audit Mode (dev-only, format/log)
   │
   ▼
lib/data/crops.ts   ← file-based: load crops_data.json (validate 4 nhóm)
   │
   ▼
crops_data.json     (15 cây, Schema v2)   [tương lai: PostgreSQL JSON columns]
```

## Cấu trúc thư mục

```
app/
  page.tsx                     Onboarding client component + 2 tầng hiển thị
  layout.tsx                   lang="vi", system font stack, metadata
  api/recommendations/route.ts POST endpoint duy nhất của MVP
components/
  CropCard.tsx                 Card 1 recommendation (role badge, why, add-to-garden)
lib/
  data/crops.ts                Data layer: getAllCrops/getCropById/validateDataset
  recommendation-engine/       Engine core (xem modules/)
  explanation.ts               Template "Why" tiếng Việt (buildWhyText)
tests/
  golden.test.ts               21 test (20 Golden Cases + dataset count)
scripts/
  audit.ts                     CLI audit mode cho context mẫu
openspec/                      Specs (3 capabilities) + 3 change proposals
crops_data.json · golden_test_cases.json · plan1_final_v2.md
.github/workflows/ci.yml       tsc → vitest → lint → build
```

## Pipeline Recommendation Engine (plan 4.3)

```
Hard Constraints Filter (temp chết / nắng / độ sâu chậu — LOẠI TRỪ TUYỆT ĐỐI)
        ▼
Candidate Crops
        ▼
Expected Success Score
   = Season_Fit×0.30 + Temp_Optimal×0.25 + Beginner_Ease×0.20
   + Fast_Harvest×0.15 + Sunlight/Space×0.10      (trọng số đổi theo goal)
        ▼
Controlled Diversity → Top 3 = 2 easy + 1 step-up (cây quả tốt nhất, chọn RIÊNG khỏi ranking)
        ▼
Top 3 | NO_MATCH_STATE (nếu candidates rỗng)
```

## Luồng dữ liệu chính

1. **Onboarding (client):** location → (Level 1: gọi API với default balcony/3h/15cm) → goal → micro-climate (Level 2: proxy window/balcony/garden → sunlight/pot/location_type).
2. **API:** validate context → `getRecommendations` → map kết quả → JSON `{status, recommendations:[{crop_id, name, role, score, days_to_harvest, why}]}` hoặc `{status:"no_match", message}`. **Không** expose candidates/excluded (audit là dev-only).
3. **Engine:** resolve weather (context.weather ?? forecast_* ?? dummy) → hard filter → score → sort → step-up → kết quả kèm `candidates` + `excluded` (phục vụ audit).

## Quyết định kiến trúc quan trọng

- **Backend = Next.js API routes** cho MVP (tách engine khỏi route để migrate microservice sau nếu cần).
- **Weather abstraction từ đầu:** engine không gọi weather API; nhận `context.weather` optional, thiếu thì dùng dummy theo mùa. Phase 2 chỉ swap `WeatherProvider`.
- **Data layer đóng gói:** engine chỉ biết `getAllCrops()`; migrate sang Postgres không đổi chữ ký.
- **Audit data đi kèm kết quả engine** (không chạy lại engine): `RecommendationResult` luôn có `candidates` + `excluded`.
- **GPS chỉ lưu cấp vùng** (không lưu tọa độ — Nghị định 13/2023, plan mục 9).
