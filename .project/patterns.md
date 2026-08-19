# Patterns & Quy ước

## Data Model — Schema v2 (plan 4.2)

Lưu 1 record/JSON nhưng **bắt buộc tách 4 nhóm type** trong code (`lib/recommendation-engine/types.ts`):

| Nhóm | Vai trò | Ghi chú |
|---|---|---|
| `CropBase` | Metadata tĩnh (names, category, difficulty, tags, timeline, provenance) | KHÔNG được ghi đè bởi logic |
| `HardConstraints` | Ngưỡng SỐNG-CHẾT (temp_death_max/min kèm reason+source, min_sunlight, min_pot_depth) | Bộ lọc loại trừ |
| `GrowingRules` | optimal_conditions + `regional_rules` (planting_windows, anomaly_flags, notes, source) | Được phép cập nhật theo vùng |
| `BeginnerSuccessFactors` | forgiveness ×2, disease_resistance, visibility_of_success | Điểm "dễ cho người mới" |

Mục đích tách nhóm: tránh Agent vô tình ghi đè metadata tĩnh khi sửa quy tắc vùng miền.

## ⚠️ Pattern bất biến — Hard Constraints ≠ Scoring

- Hard constraints **LOẠI TRỪ tuyệt đối TRƯỚC** khi chấm điểm.
- **Không bao giờ** dùng weighted average để "cứu" cây vượt ngưỡng chết.
- Comment giải thích điều này nằm ở `types.ts`, `engine.ts`, `scoring.ts` — giữ nguyên.

## Scoring

- Mỗi component trả 0–100; `score = Σ weight×component`, clamp 0–100.
- Trọng số mặc định `.30/.25/.20/.15/.10`; bộ riêng theo goal:
  - `fastest_harvest` (⚡): Fast .35, và Fast_Harvest đơn điệu giảm theo số ngày (đỉnh ~15 ngày)
  - `daily_food` (🍅): Fast .20 + penalty −30 cho cây `single_harvest`
  - `easy_care` (🌿): Beginner .30 + Sun/Space .20
  - `absolute_beginner` (experience): Beginner .30 + Sun/Space .15
- `community_fail_rate_override`: score × (1 − 0.8×rate) — **không** hard exclude.

## Season = scoring, không phải hard exclude

- Cây ngoài cửa sổ trồng → Season ≈ 20/100 (hạ rank mạnh), **không bị loại cứng**.
- Căn cứ: TC04 (xa_lach tháng 9 phải vào Top 3) + TC14 note ("cai_xanh KHÔNG bị loại cứng").
- Vùng không có regional_rules (highland) → season fallback theo nhiệt độ.

## Controlled Diversity

- Slot 3 = **step-up**: cây `fruit_vegetable` tốt nhất còn sống sót, chọn RIÊNG khỏi ranking tổng (plan 4.3: `top_2 = ranked[:2]` + `find_best_step_up(candidates)`).
- Chỉ fallback sang cây easy thứ 3 khi **không còn cây quả nào** (thiếu nắng/chậu nông).
- Role: `easy` | `step_up` (UI hiện "🌱 Dễ trồng" / "🍅 Bước lên").

## Weather

- `RecommendationContext.weather` optional; field `forecast_temp_max_c/min_c/forecast_condition` cũng chấp nhận ở top-level (alias, test cases dùng kiểu này).
- `resolveWeather`: context.weather → top-level → dummy. Kết quả luôn có max/min.
- Dummy: bảng nhiệt độ trung bình theo tháng cho 3 vùng (`MONTHLY_TEMPS` trong `weather.ts`).

## Testing

- **Golden Test Cases là nguồn sự thật**: không sửa test để nó pass — sửa engine, hoặc báo cáo conflict.
- 3 kiểu assertion: `must_include` (trong Top 3), `must_exclude` (ngoài Top 3), `must_include_fruit_vegetable` (Top 3 có ≥1 cây quả), TC15 → `no_match`, TC20 → 2 mùa khác nhau đáng kể.
- Chạy: `npm test` (vitest run), CI chạy `tsc → vitest → lint → build`.

## UI

- Tiếng Việt, mobile-first (Tailwind, max-w-2xl, grid 1 cột mobile → 3 cột desktop cho icon micro-climate).
- Trang chủ là 1 client component quản lý state onboarding; card là component riêng.
- Không dùng Google Fonts (bị chặn mạng) — system font stack.
- NO_MATCH → warning panel amber; add-to-garden → toast placeholder.

## Naming & cấu trúc

- File: kebab-case; component: PascalCase; hàm: camelCase.
- ID cây: snake_case tiếng Việt không dấu (`cai_xanh`, `rau_muong`).
- Region: `north_vietnam` | `south_vietnam` | `highland_vietnam`.
- Không import engine từ UI trực tiếp — luôn qua API (giữ ranh giới).
