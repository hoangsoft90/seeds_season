# lib/recommendation-engine

Core recommendation engine — **Bước 3-4** (chưa implement ở Bước 1).

Nội dung sẽ bao gồm:

- `types.ts` — Data Model theo Schema v2: `CropBase`, `HardConstraints`, `GrowingRules` (kèm `regional_rules`), `BeginnerSuccessFactors`, `Crop`, `RecommendationContext`.
- `engine.ts` — `getRecommendations(context, crops)` theo pipeline mục 4.3:
  `Hard Constraints Filter → Candidate Crops → Expected Success Score → Controlled Diversity (2 easy + 1 step-up) → Top 3 | NO_MATCH_STATE`.
- `scoring.ts` — các thành phần điểm: Season_Fit (0.30) / Temp_Optimal_Fit (0.25) / Beginner_Ease (0.20) / Fast_Harvest_Bonus (0.15) / Sunlight-Space_Fit (0.10).
- `weather.ts` — interface `WeatherProvider` + dummy provider (giá trị trung bình theo mùa), để Phase 2 swap API thật không cần refactor engine.
- `audit.ts` — Recommendation Audit Mode (dev-only): log điểm từng thành phần + lý do exclude.

⚠️ **Quy tắc bất biến (đừng refactor nhầm):** Hard Constraints là bộ lọc loại trừ TUYỆT ĐỐI, chạy TRƯỚC scoring. Không bao giờ dùng weighted average để "cứu" cây đã vượt ngưỡng chết (xem `plan1_final_v2.md` mục 4.2-4.3, 9).
