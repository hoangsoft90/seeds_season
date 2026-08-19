# working.md — Project đang ở đâu

> File này là "nhật ký trạng thái" — **cập nhật cuối mỗi phiên làm việc** để lần sau mở lại hiểu ngay. Cập nhật lần cuối: 2026-08-19 (**Phase 2 hoàn thành** — weather-api-swap + ai-explanation archived). Test suite: **84/84**.

## Đã xong (MVP — vòng hiện tại)

- [x] Bước 1-7: scaffold → data model Schema v2 → engine → audit → tests → API → UI
- [x] **Golden Test Cases 21/21 pass** (20 case + dataset-count), CI workflow `.github/workflows/ci.yml`
- [x] `POST /api/recommendations` + explanation "Why" tiếng Việt; NO_MATCH đúng plan 5.4
- [x] UI onboarding: location (city/GPS) → goal (tùy chọn) → micro-climate 3 icon → 🌍 Level 1 + 🪴 Level 2, không auth
- [x] OpenSpec: 3 specs (recommendation-engine / recommendations-api / onboarding) — validate 6/6
- [x] Knowledge Items `.project/` (12 file) + memory files root (AGENTS/CLAUDE/context/working/operating_rules)
- [x] **Change `crop-detail-pages`** (đã archive): trang `/crops/[id]` tutorial từ dữ liệu Schema v2 (SSG 15 trang) + link từ CropCard + notice confidence thấp
- [x] **Change `kitchen-scraps-tips`** (đã archive): tab "Mẹo vặt" regrow từ phế liệu bếp (hành lá từ gốc, rau muống từ cành)

## Việc vừa làm (phiên này)

15. **Review scope Phase 2**: user chọn cả 2 feature (weather API + AI explanation), bỏ Ask Community (cần user density) + Monetization (cần payment integration).
16. **Implement + archive `weather-api-swap`**: `lib/recommendation-engine/weather.ts` thêm `OpenMeteoWeatherProvider` (Open-Meteo free API, fetch async, in-memory cache 1h, fallback DummyWeatherProvider khi fail) · `app/api/recommendations/route.ts` fetch weather async trước khi gọi engine sync (put vào `ctx.weather`) · Tests: 5 (provider + cache + fallback + condition mapping). Verify: 79/79 test, tsc/lint/build sạch.
17. **Implement + archive `ai-explanation`**: `lib/explanation/ai-provider.ts` (OpenAI gpt-4o-mini, system prompt tiếng Việt, max 150 tokens, temp 0.7, cache 5 phút) + fallback template text khi không có `OPENAI_API_KEY` hoặc API fail · `app/api/recommendations/route.ts` dùng `Promise.all` generate explanations song song cho 3 crops · Tests: 5 (AI success + cache + fallback no key + fallback API error + template unchanged). Verify: 84/84 test, tsc/lint/build sạch.

## Việc vừa làm (phiên trước)

11. **Review scope Phase 1.5 còn lại**: user quyết định bỏ seo-basics (app mobile, không cần SEO), giữ garden-progress + harvest-brag-card.
12. **Implement + archive `garden-progress`**: `components/PlantProgress.tsx` (progress bar + stage label + milestone badge: 🌱 Nảy mầm / 🌿 Lớn lên / 🎉 Sắp thu hoạch, cửa sổ 2 ngày, 2-day window) · `GardenView` thêm section “Đã thu hoạch” + nút “🎊 Thu hoạch” khi progress ≥ 80% · `lib/garden/types.ts` thêm status `harvested` + `harvested_at` · `lib/garden/store.ts` thêm `markHarvested()` · `app/api/garden/[id]/route.ts` PATCH hỗ trợ harvest action · Tests: 10 store + 8 progress. Verify: 68/68 test, tsc/lint/build sạch.
13. **Implement + archive `harvest-brag-card`**: `components/HarvestBragCard.tsx` (toggle ẩn/hiện, animated card, copy to clipboard, toast “Đã sao chép!”) · `lib/labels.ts` thêm `DEFAULT_YIELD_KG` + `MARKET_PRICE_PER_KG` · GardenView tích hợp card cho harvested plants · Tests: 7 (giá trị tính toán + copy text). Verify: 74/74 test, tsc/lint/build sạch.
14. **Bỏ seo-basics**: user xác nhận app mobile-first, SEO không cần thiết — xóa change proposal.

## Việc vừa làm (phiên trước)

1. Build engine + test: 6 golden case conflict test-data vs data → **3 fix engine hợp lệ** (Fast_Harvest monotonic theo goal, trọng số absolute_beginner, revert step-up về plan-faithful) + **8 sửa test data được user duyệt** (TC04/09/13/16 đổi must_include/pot; TC10/11/12/18 → assertion `must_include_fruit_vegetable`).
2. Tạo OpenSpec: specs cho phần đã code + 3 change proposals (đầy đủ proposal/specs/design/tasks).
3. Tạo `.project/` Knowledge Items + memory files root.
4. **Implement + archive `crop-detail-pages`**: `app/crops/[id]/page.tsx` (server component, `generateStaticParams` 15 cây, `dynamicParams=false` → 404) render thời vụ theo vùng / điều kiện lý tưởng / chậu & giới hạn / timeline / dành cho người mới + notice confidence low; `lib/labels.ts` (label VN dùng chung); `CropCard` link tên cây + "Xem cách trồng →" → `/crops/[id]`. Verify: tsc/lint sạch, 21/21 test, build 15 trang SSG, e2e 200/404. Spec `crop-detail` đã vào main specs.
5. **Implement + archive `kitchen-scraps-tips`**: `lib/data/scrap-tips.ts` (chọn cây tag `regrow_from_scraps`/`regrow_from_cuttings` từ getAllCrops + hướng dẫn 5 bước viết tay cho hanh_la/rau_muong) · `components/ScrapTip.tsx` (card icon + tên + các bước 1-2-3 + link `/crops/[id]`) · tab toggle "🌱 Gợi ý trồng gì / 🧑‍🍳 Mẹo vặt" trong `app/page.tsx` (mặc định = grow, tips hiện khi bấm tab — tách biệt khỏi luồng recommendation). Verify: tsc/lint sạch, 21/21 test, build OK, tips có trong client bundle, home 200. Spec `kitchen-scraps-tips` đã vào main specs.
6. **Review scope Phase 1.5 + tạo 3 change proposals mới** (user quyết định **hoãn `pwa-support`**, ưu tiên retention): `add-to-garden-auth` · `my-garden` · `deterministic-first-aid` — mỗi change đủ proposal/specs/design/tasks, validate 9/9 strict.
7. **Implement `add-to-garden-auth` (Clerk — user đã chốt)**: cài `@clerk/nextjs@7.7.7` · `ClerkProvider` trong `<body>` (`app/layout.tsx`) · **`proxy.ts`** (migrate từ `middleware.ts` — Next 16 deprecated) gate `/api/garden*` trả **401 JSON** · trang `app/sign-in/[[...sign-in]]` + `sign-up/[[...sign-up]]` · `components/AddToGardenButton.tsx` (chưa login → `useClerk().redirectToSignIn({ redirectUrl })`) · `CropCard` dùng nút mới · trang chủ `UserButton` / `SignInButton` + `SignUpButton` modal qua `<Show>`. Matcher thêm `'/__clerk/:path*'` (hướng dẫn CLI). Verify: tsc/lint sạch, **21/21 test**, build OK, e2e keys thật (home 200, sign-in 200 + Clerk component, sign-up 200, `/api/garden/add` chưa login → **401** đúng message). **Đã archive** → spec `user-auth` vào main specs, validate 9/9.
8. **Clerk keys**: user đã lưu vào `.env.local` (keyless instance `ins_3I53pueBiDZFU3V7uZFL6PNgJee`) — `clerk doctor` ✓. **Lưu ý**: `clerk auth login`/`clerk init` KHÔNG chạy được trong sandbox (OAuth redirect localhost trên máy user → 404) — keys lấy từ Dashboard. Tasks 3.4 (sign out e2e) chờ user test browser.
9. **Implement `my-garden` (đã archive)**: `lib/garden/types.ts` (GardenPlant, GhostCause, DuplicateCropError) + `lib/garden/store.ts` (file-based `data/garden.json`, env `GARDEN_DATA_FILE` cho test, **invariant never-delete**: remove/markGhost chỉ chuyển ghost) · API `POST/GET /api/garden` + `PATCH/DELETE /api/garden/[id]` (check `auth()` trong handler — 401/400/404/409) · nudge data moat trong `lib/explanation.ts` (ghostHistory + tháng tương tự ±1 → "Lần trước... thử Z thay thế") wire vào `/api/recommendations` khi user login, **KHÔNG đổi engine** · UI `/garden` (server, redirect sign-in) + `GardenView` (mark dead 4 cause ☀️🐛🌊❓, remove, empty state) + `AddToGardenButton` gọi POST thật + link "🪴 Vườn của tôi". Verify: tsc/lint sạch, **47/47 test** (21 golden + 8 store + 13 API integration mock auth + 5 explanation), build OK, e2e (home 200, /garden anonymous → 307 sign-in, api garden 401). Đã thêm `vitest.config.ts` (alias `@/`).
10. **Implement `deterministic-first-aid` (đã archive)**: `lib/data/first-aid.ts` — 6 triệu chứng (🍂 lá vàng, 🥀 héo rũ, 🟤 đốm lá, 🐛 sâu bọ, 💧 úng rễ, 🐢 chậm lớn) mỗi cái 2-3 câu hỏi phân nhánh luật cứng → diagnosis + remedy từng bước + seekHelp · `lib/first-aid.ts` (hàm thuần getNextNode/getNode/isDiagnosis) · `components/FirstAidWizard.tsx` (wizard client-side, nút bắt đầu lại/quay lại) · trang `/first-aid` (không login, không API) · entry "🆘 Cây có vấn đề?" trên crop detail. Verify: tsc/lint sạch, **58/58 test** (thêm 11 first-aid: DFS bảo vệ không cycle/không ngõ cụt — cho phép node hội tụ; scenario spec lá vàng→úng rễ/thiếu nước), build OK, e2e (/first-aid 200, crop detail có entry).

## Việc tiếp theo (theo thứ tự ưu tiên)

1. **Phase 2 HOÀN THÀNH** — weather-api-swap + ai-explanation archived. Test suite: **84/84**.
2. ~~**pwa-support**~~ — ⏸ **DEFERRED** — quay lại bất cứ lúc nào.
3. **Còn lại Phase 2**: Ask Community (cần user density), Monetization (cần payment integration) — bỏ qua lúc này.
4. **Phase 3**: Commerce (affiliate, seed/supply links) — chờ có user thật.

## Kiểm chứng nhanh (trước khi báo "xong" bất kỳ việc gì)

```bash
npm test          # 84/84
npx tsc --noEmit  # sạch
npm run lint      # sạch
npm run build     # ok
npx openspec validate --all  # 13/13 nếu đụng openspec
```

## Vấn đề mở / lưu ý

- **Google Fonts bị chặn** trong dev → system font stack; đừng bật lại `next/font/google` trừ khi mạng OK.
- **Clerk keys đã có** trong `.env.local` (keyless `ins_3I53pueBiDZFU3V7uZFL6PNgJee`) — đừng xóa file; `.env*` gitignored.
- **My Garden storage** = file `data/garden.json` (gitignored). Chỉ migrate Postgres khi deploy thật — giữ nguyên chữ ký hàm store.
- **Clerk Backend API rate-limit user creation** trên instance keyless (lỗi `form_data_missing` gây hiểu lầm) → đừng dùng cách tạo user API cho e2e; dùng integration test với `vi.mock("@clerk/nextjs/server")` (xem `tests/garden-api.test.ts`).
- **First Aid data** là luật cứng viết tay — muốn thêm triệu chứng: thêm entry vào `FIRST_AID_SYMPTOMS` (nhớ chạy test DFS — mọi nhánh phải kết thúc ở diagnosis, không cycle).
- **`createRouteMatcher` deprecated** trong Clerk v7 → khi code `my-garden`, check `auth()` trong từng route handler (defense in depth).
- **Next 16**: `middleware.ts` đã migrate → `proxy.ts` (đừng tạo lại `middleware.ts`).
- **Pitfall tool**: `pkill -f "next dev"` khớp chính command đang chạy (chứa chuỗi "next dev") → tự kill, output rỗng. Muốn kill server dùng pattern self-safe như `pkill -f "next[-]server"`.
- **Dev server background chết giữa phiên** → test e2e trong 1 lệnh (start → curl → pkill).
- Dữ liệu confidence medium/low **cần expert review** trước production (plan 4.5).
- Schema chưa có `spacing` (khoảng cách trồng) — bỏ qua tới khi có dữ liệu.
- Khi code xong 1 change → `npx openspec archive <id>` để gộp delta vào main specs, rồi cập nhật file này + `.project/state.md`.
