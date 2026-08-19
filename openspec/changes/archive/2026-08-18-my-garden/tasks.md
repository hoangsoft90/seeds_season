> Dependency: cần `add-to-garden-auth` xong (user identity) trước khi phần lưu vườn per-user chạy thật. Tasks 1.1-1.2 (data model) làm được song song.

## 1. Data model & storage

- [x] 1.1 Định nghĩa types: `lib/garden/types.ts` — `GardenPlant` (id, user_id, crop_id, planted_at, status: growing|ghost, died_at?, cause?), `GhostCause` enum (sun_heat/pest/waterlogged/unknown), `DuplicateCropError`
- [x] 1.2 `lib/garden/store.ts` — file-based per-user (`data/garden.json`, env-override `GARDEN_DATA_FILE` cho test): add/list/markGhost/remove (remove = ghost cause unknown, KHÔNG xoá vật lý) + `getGhostHistory`

## 2. API

- [x] 2.1 `POST /api/garden` (auth): thêm cây — 401 chưa login, 400 crop_id lạ, 409 trùng cây đang trồng
- [x] 2.2 `GET /api/garden` (auth): danh sách vườn của user
- [x] 2.3 `PATCH /api/garden/[id]` (auth): đánh dấu ghost + cause; owner-only (404 cho cây người khác)
- [x] 2.4 `DELETE /api/garden/[id]` (auth): bỏ theo dõi → chuyển ghost cause unknown (không xoá vật lý)
- [x] Route handlers check `auth()` trực tiếp (Clerk v7 khuyến nghị — defense in depth, ngoài proxy.ts gate 401)

## 3. Gợi ý theo lịch sử thất bại (data moat)

- [x] 3.1 `lib/explanation.ts` nhận `ghostHistory` + `alternativeNames` → nudge "Lần trước (tháng X) bạn trồng Y nhưng <cause>. Tháng này thử Z thay thế nhé!" khi fail cùng cây ở tháng tương tự (±1, vòng năm); `/api/recommendations` đọc ghost history khi user đã login
- [x] 3.2 KHÔNG đổi điểm engine — **Golden Tests vẫn 21/21**

## 4. UI

- [x] 4.1 Trang `/garden` (server component, auth → redirect `/sign-in?redirect_url=/garden` khi chưa login): danh sách growing + ghost, empty state mời thêm từ gợi ý
- [x] 4.2 `AddToGardenButton` gọi `POST /api/garden` thật khi đã login (nút đổi "✓ Đã thêm", lỗi hiển thị inline); CropCard truyền cropId/cropName
- [x] 4.3 Flow đánh dấu chết: 4 cause nhanh (☀️/🐛/🌊/❓) → ghost; `components/GardenView.tsx` (client, useRouter)
- [x] 4.4 Link "🪴 Vườn của tôi" trên trang chủ (chỉ hiện khi signed-in)

## 5. Kiểm chứng

- [x] 5.1 `npx tsc --noEmit` + `npm run lint` — sạch
- [x] 5.2 `npm test` — **47/47** (21 golden + 8 store + 13 API integration với mock auth + 5 explanation nudge); thêm `vitest.config.ts` (alias `@/`)
- [x] 5.3 `npm run build` + e2e: home 200 · `/garden` anonymous → 307 `/sign-in?redirect_url=/garden` · `/api/garden` anonymous → 401 · add→list→mark ghost→list verified qua integration tests (mocked auth — không phụ thuộc Clerk API rate limit)
