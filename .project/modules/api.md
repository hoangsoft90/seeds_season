# Module: API

Đường dẫn: `app/api/recommendations/route.ts` + `lib/explanation.ts`.

## Endpoint duy nhất (MVP)

**`POST /api/recommendations`** — nhận `RecommendationContext`, trả Top 3 + "Why" (template text).

### Request body (RecommendationContext)

| Field | Bắt buộc | Ghi chú |
|---|---|---|
| `region` | ✅ | `north_vietnam` \| `south_vietnam` \| `highland_vietnam` |
| `month` | ✅ | 1–12 |
| `location_type` | ✅ | `window` \| `balcony` \| `garden` |
| `sunlight_hours` | ✅ | số ≥ 0 |
| `pot_depth_cm` | ✅ | số dương hoặc `null` (đất vườn) |
| `user_goal` | ⬜ | `fastest_harvest` \| `daily_food` \| `easy_care` |
| `user_experience` | ⬜ | `absolute_beginner` |
| `community_fail_rate_override` | ⬜ | `Record<crop_id, rate 0–1>` |
| `weather` | ⬜ | `{forecast_temp_max_c?, forecast_temp_min_c?, forecast_condition?}` |
| `forecast_temp_max_c/min_c/condition` | ⬜ | alias top-level (weather thắng nếu cả hai) |

### Response

```jsonc
// status: "ok"
{ "status": "ok", "region": "...", "month": 8,
  "recommendations": [
    { "crop_id": "rau_muong", "name": "Rau muống", "scientific": "...",
      "category": "leafy_green", "role": "easy", "score": 93.5,
      "days_to_harvest": [20, 30],
      "why": "đang đúng thời vụ ở miền Bắc. nhiệt độ đang thuận lợi. ..." } ] }

// status: "no_match"
{ "status": "no_match", "message": "⚠️ Điều kiện hiện tại khá khắc nghiệt. ..." }

// lỗi
{ "error": "'region' không hợp lệ: ..." }   // HTTP 400
```

### Quyết định

- **Không auth** ở bước này (plan 5.1: chỉ cần login khi bấm "Thêm vào vườn" — Phase 1.5).
- **Không expose audit data** (candidates/excluded) qua API public — dev-only.
- Validation thủ công (không dùng zod) — MVP, đủ rõ ràng; có thể thêm thư viện sau.
- `lib/explanation.ts`: `buildWhyText(crop, components, region, role)` — template tiếng Việt theo điểm từng thành phần; Phase 2 thay bằng AI explanation layer (vẫn không đổi engine).
