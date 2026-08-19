# 🌱 Trồng gì hôm nay? — Gợi ý trồng rau/củ/quả theo mùa & vị trí

Ứng dụng gợi ý trồng trọt cho **người mới trồng ban công ở đô thị Việt Nam**.
North Star: **First Successful Grow** — "Cây nào tôi có khả năng trồng THÀNH CÔNG nhất ngay bây giờ?",
không phải "Cây nào phù hợp khí hậu của tôi?" (xem `plan1_final_v2.md`).

## Tech stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4** (PWA-ready, mobile-first)
- Backend: Next.js API routes (MVP) — engine tách rõ trong `lib/`
- DB: chưa dùng (file-based `crops_data.json`); migrate sang PostgreSQL + JSON columns sau
- Testing: **Vitest** — Golden Test Cases chạy như regression suite trong CI (GitHub Actions)

## Cấu trúc

```
app/                          # Routes (trang chủ + API)
  api/recommendations/route.ts# POST /api/recommendations (Top 3 + explanation "Why")
  page.tsx                    # Onboarding: location → goal → micro-climate, 2 tầng gợi ý
components/CropCard.tsx       # Card hiển thị 1 recommendation
lib/
  data/crops.ts               # Data layer file-based (getAllCrops, validateDataset)
  recommendation-engine/
    types.ts                  # Data Model Schema v2: CropBase/HardConstraints/GrowingRules/BeginnerSuccessFactors
    engine.ts                 # getRecommendations: Hard Filter → Scoring → Controlled Diversity → NO_MATCH
    scoring.ts                # Expected Success Score (Season/Temp/Beginner/FastHarvest/Sun-Space) + trọng số theo goal
    weather.ts                # WeatherProvider interface + DummyWeatherProvider (Phase 2 swap API thật)
    audit.ts                  # Recommendation Audit Mode (dev-only)
  explanation.ts              # Template "Why" tiếng Việt
tests/golden.test.ts          # 20 Golden Test Cases (TC01-TC20)
scripts/audit.ts              # CLI chạy audit mode cho context mẫu
crops_data.json               # Dữ liệu 15 cây (Schema v2)
golden_test_cases.json        # Bộ test case cứng
```

## Chạy

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # Golden Test Cases (regression suite)
npx tsc --noEmit   # typecheck
npm run lint
npm run build
npx tsx scripts/audit.ts   # Recommendation Audit Mode (dev-only)
```

## Quy tắc bất biến của engine

1. **Hard Constraints ≠ Scoring**: ngưỡng sống-chết (temp chết, nắng tối thiểu, độ sâu chậu)
   loại trừ TUYỆT ĐỐI trước khi chấm điểm. Không bao giờ dùng weighted average để
   "cứu" cây vượt ngưỡng chết.
2. **Season là scoring, không phải hard exclude**: cây trái mùa bị hạ rank mạnh (Season≈20)
   thay vì loại cứng (căn cứ TC04/TC14 — xem comment trong `scoring.ts`).
3. **NO_MATCH_STATE**: nếu sau hard filter không còn cây nào → trả NO_MATCH, không ép
   trả danh sách gượng ép.
4. **Controlled Diversity đúng plan 4.3**: step-up được chọn RIÊNG BIỆT khỏi ranking
   tổng — slot 3 luôn là cây quả (fruit_vegetable) tốt nhất còn sống sót sau hard
   constraints, kể cả khi điểm thấp hơn cây rau lá đứng thứ 3. Chỉ khi KHÔNG còn cây
   quả nào (thiếu nắng/chậu nông) thì slot 3 mới lấy cây easy kế tiếp.
5. **Weather abstraction**: `RecommendationContext.weather` optional; Phase 2 chỉ swap
   provider thật, không refactor engine.

## Ghi chú dữ liệu

Dữ liệu trong `crops_data.json` có confidence `medium`/`low` cần expert review trước
production (mục 4.5 trong plan). Không dùng làm nguồn duy nhất cho quyết định canh tác quan trọng.
