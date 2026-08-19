# State — Trạng thái hiện tại

> Cập nhật lần cuối: sau vòng MVP (7 bước) — 2026-08-18.

## Đã hoàn thành

| Hạng mục | Trạng thái | Ghi chú |
|---|---|---|
| Scaffold Next.js 16 + TS + Tailwind 4 | ✅ | package `seeds-season`, `npm run build` pass |
| Data Model Schema v2 (4 nhóm) | ✅ | `lib/recommendation-engine/types.ts` |
| Data layer file-based | ✅ | `lib/data/crops.ts` + validateDataset (CI bắt lệch schema) |
| Recommendation Engine | ✅ | pipeline 4.3 đầy đủ, smoke + API verified |
| Weather abstraction | ✅ | `WeatherProvider` + `DummyWeatherProvider` (theo mùa) |
| Audit Mode | ✅ | `lib/recommendation-engine/audit.ts` + `scripts/audit.ts` CLI |
| Golden Test Cases | ✅ **21/21 pass** | 20 case + dataset-count; CI `ci.yml` |
| API `POST /api/recommendations` | ✅ | validate 400, Top 3 + Why, NO_MATCH |
| UI Onboarding + 2 tầng | ✅ | location → goal → micro-climate; HTTP 200; responsive |
| OpenSpec | ✅ | 8 specs + 1 change (pwa-support DEFERRED), validate 10/10 strict |
| Knowledge Items | ✅ | folder `.project/` này |
| Change `crop-detail-pages` | ✅ đã archive | `/crops/[id]` tutorial SSG + link từ card + notice confidence low |
| Change `kitchen-scraps-tips` | ✅ đã archive | tab "Mẹo vặt" regrow: `lib/data/scrap-tips.ts` + `components/ScrapTip.tsx` + tab toggle trong `app/page.tsx` |
| Change `add-to-garden-auth` | ✅ đã archive | Clerk `@clerk/nextjs@7.7.7`: proxy.ts gate `/api/garden*` 401 + sign-in/sign-up + AddToGardenButton auth-gate + UserButton/SignIn/SignUp trên header |
| Change `my-garden` | ✅ đã archive | `lib/garden/` (store file-based never-delete) + API CRUD auth + Ghost Plant (died_at + cause) + nudge data moat trong explanation + trang `/garden` |
| Change `deterministic-first-aid` | ✅ đã archive | `lib/data/first-aid.ts` (6 triệu chứng luật cứng) + `lib/first-aid.ts` (getNextNode) + `/first-aid` wizard client-side + entry "🆘 Cây có vấn đề?" trên crop detail |
| Change `garden-progress` | ✅ đã archive | `components/PlantProgress.tsx` (progress bar + stage + milestone badges) + harvested section + nút "Thu hoạch" + `markHarvested()` store + API |
| Change `harvest-brag-card` | ✅ đã archive | `components/HarvestBragCard.tsx` (toggle animated card + copy to clipboard) + `DEFAULT_YIELD_KG`/`MARKET_PRICE_PER_KG` trong labels.ts |
| Change `weather-api-swap` | ✅ đã archive | `OpenMeteoWeatherProvider` (free API, cache 1h, fallback dummy) + route fetch async trước engine sync |
| Change `ai-explanation` | ✅ đã archive | `lib/explanation/ai-provider.ts` (gpt-4o-mini, fallback template, cache 5 phút) + Promise.all song song 3 crops |

## Lịch sử quyết định sửa engine (đừng revert nhầm)

1. **Fast_Harvest theo goal**: mặc định Gaussian đỉnh 30 ngày; `fastest_harvest` → đơn điệu giảm (đỉnh ~15) — nếu không, hành lá (20 ngày) bị chấm thấp hơn cải xanh (30 ngày), ngược mục đích goal.
2. **Step-up plan-faithful**: revert bản "competitive step-up" (điểm ≥ cây easy thứ 3) — user xác nhận step-up phải chọn RIÊNG khỏi ranking (TC18: dau_bap được chọn dù đứng thứ 4 tổng).
3. **Trọng số absolute_beginner**: `.30/.15/.30/.10/.15` (Sun/Space lên) — để hành lá vào Top 3.
4. **Anomaly flag `june_july_heatwave`** chỉ áp tháng 6-7 (không phải 8).

## Test suite hiện tại (84/84)

- `tests/golden.test.ts` — **21/21** (golden cases, engine không đổi)
- `tests/garden.test.ts` — 10 (store: per-user isolation, never-delete, duplicate, owner-only, harvest)
- `tests/garden-api.test.ts` — 13 (API routes với `vi.mock("@clerk/nextjs/server")` — 401/400/404/409, ghost rules)
- `tests/explanation.test.ts` — 5 (nudge data moat: tháng tương tự ±1, alternative đầu tiên được chọn)
- `tests/first-aid.test.ts` — 11 (DFS bảo vệ: mọi nhánh kết thúc ở diagnosis, không cycle — cho phép node hội tụ; scenario spec lá vàng → úng rễ/thiếu nước; invalid ids)
- `tests/plant-progress.test.ts` — 8 (progress calc, stage detection, milestone badges, null timeline, cap 100%)
- `tests/harvest-brag.test.ts` — 6 (giá trị tính toán theo category, copy text format, unknown fallback)
- `tests/weather-openmeteo.test.ts` — 5 (OpenMeteo provider: API success, fallback error, fallback timeout, cache hit, condition mapping)
- `tests/explanation-ai.test.ts` — 5 (AI provider: fallback no key, fallback API error, cache, AI success, template unchanged)
- `vitest.config.ts`: alias `@/` → project root

## Golden Test Cases — các sửa đổi test data đã được user duyệt

- TC04: must_include → `["rau_muong"]` (hung_que/xa_lach không thể vào Top 3 với pot 10/tháng 9)
- TC09: must_include → `["hanh_la"]` (cu_cai bị rau_muong áp đảo tuyệt đối)
- TC10/TC11/TC12/TC18: đổi sang `must_include_fruit_vegetable: true` (Top 3 phải có ≥1 cây quả)
- TC13: pot `25 → 30` (dau_bap cần 30cm)
- TC16: must_include → `["hanh_la", "cai_ngot"]` (xa_lach/cu_cai bị vượt nhẹ ở Đà Lạt)

**Nguyên tắc giữ nguyên:** KHÔNG sửa test để nó pass — sửa engine hoặc báo user; mọi sửa test data phải có lý do + được duyệt.

## Phase 1.5 — quyết định scope (2026-08-18, user review)

- User **hoãn `pwa-support`** (retention ưu tiên hơn PWA). Artifacts giữ, proposal.md có note DEFERRED.
- Tạo 3 change mới: **`add-to-garden-auth`**, **`my-garden`** (Ghost Plant data moat, phụ thuộc auth), **`deterministic-first-aid`** (độc lập).
- **Provider đã chốt: Clerk** (`@clerk/nextjs@7.7.7`) — Gravity khuyến nghị, pre-built UI, session cookie.

## add-to-garden-auth — ✅ ĐÃ ARCHIVE (2026-08-18)

- Spec `user-auth` đã vào main specs (4 requirements). Code: `ClerkProvider` trong `<body>` · **`proxy.ts`** (migrate từ `middleware.ts` — Next 16) gate `/api/garden*` trả **401 JSON** (không dùng `auth().protect()` vì trả 404) · `app/sign-in/[[...sign-in]]` + `sign-up` · `components/AddToGardenButton.tsx` (redirect sign-in kèm `redirectUrl`) · trang chủ `UserButton`/`SignInButton`+`SignUpButton` modal qua `<Show>`. Matcher có `'/__clerk/:path*'`.
- **Clerk v7 Core 3 quirk** (đừng quên): `<SignedIn>/<SignedOut>` không còn → dùng `<Show when="signed-in|signed-out">`; `redirectToSignIn` trên `useClerk()`; `UserButton` không nhận `afterSignOutUrl`.
- **`createRouteMatcher` deprecated** → khi code `my-garden`: check `auth()` trong route handler (defense in depth).
- **Keys**: user đã lưu vào `.env.local` (keyless `ins_3I53pueBiDZFU3V7uZFL6PNgJee`) — `clerk doctor` ✓. `clerk auth login`/`init` KHÔNG chạy được trong sandbox (OAuth callback localhost trên máy user → 404) — keys lấy từ Dashboard.
- Verified keys thật: home 200, sign-in 200 (có Clerk component), sign-up 200, `/api/garden/add` chưa login → **401** đúng message, tsc/lint sạch, **21/21 test**, build OK (log `ƒ Proxy (Middleware)`).
- **Còn lại nhỏ**: user tự test sign-up/sign-out bằng browser (tasks 3.2/3.4 — bước "After Setup" hướng dẫn CLI).

## my-garden — quyết định implement (2026-08-18)

- **Storage**: file-based `data/garden.json` (gitignored, env `GARDEN_DATA_FILE` cho test) — migrate Postgres sau, giữ nguyên chữ ký store.
- **Invariant never-delete**: remove/markGhost chỉ chuyển `status: ghost` (cause `unknown` khi remove) — không tồn tại hàm xoá vật lý (unit test bảo vệ).
- **Nudge data moat**: explanation chỉ THÊM text khi user đã login + có ghost cùng cây ở tháng tương tự (±1, vòng năm); alternative = cây đầu tiên khác cây đang xét trong top-3. KHÔNG đụng engine → 21/21 giữ nguyên.
- **Pitfall**: Clerk Backend API rate-limit tạo user trên instance keyless (lỗi `form_data_missing`/"email_address missing" gây hiểu lầm — kể cả với gmail.com) → e2e authed dùng mock auth, không mint session qua API.

## deterministic-first-aid — quyết định implement (2026-08-18)

- Luật cứng viết tay (6 triệu chứng) — nguồn kiến thức làm vườn phổ thông an toàn, luôn kèm `seekHelp` (luật an toàn: không gây hại cây).
- Bất biến cây hỏi: **mọi nhánh từ startNodeId kết thúc ở diagnosis — không loop, không ngõ cụt**; node có thể hội tụ (chia sẻ diagnosis) — test DFS dùng in-stack set (không phải visited set) để phân biệt cycle thật vs DAG hội tụ.
- Client-side hoàn toàn — dữ liệu luật cứng bundle client (giống scrap-tips). Entry point từ crop detail; sau này thêm từ My Garden.

## Vấn đề mở / biết trước

- **Khoảng cách trồng (spacing)** chưa có trong schema — bỏ qua cho tới khi có dữ liệu.
- **Dữ liệu confidence medium/low** cần expert review trước production (plan 4.5) — UI đã có notice cho low confidence (khi crop-detail được code).
- **Google Fonts bị chặn** trong môi trường dev hiện tại → layout dùng system font stack. Nếu triển khai production có mạng, có thể bật lại `next/font/google`.
- **Dev server background** không sống sót giữa các phiên tool → test e2e trong 1 lệnh duy nhất (start → curl → pkill).

## Cách kiểm chứng nhanh

```bash
npm test           # 84/84
npx tsc --noEmit   # typecheck
npm run lint       # eslint
npm run build      # production build
npx tsx scripts/audit.ts   # audit mode (dev)
npx openspec validate --all   # openspec 13/13 strict
```
