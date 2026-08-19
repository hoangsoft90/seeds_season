# Roadmap / Todo

## Ngay tiếp theo — Phase 1.5 (3 change proposals sẵn sàng, user đã review scope)

> Mỗi change có đủ proposal + specs + design + tasks. Chạy `npx openspec status --change <id>` để xem tasks; sau khi code xong dùng `npx openspec archive <id>` để gộp delta vào main specs.

- [x] **crop-detail-pages** — ✅ đã xong + archive 2026-08-18 (spec `crop-detail` trong main specs). Trang `/crops/[id]` SSG + link từ card + notice confidence thấp.
- [x] **kitchen-scraps-tips** — ✅ đã xong + archive 2026-08-18 (spec `kitchen-scraps-tips` trong main specs). Tab "Mẹo vặt" regrow: hành lá từ gốc chợ, rau muống từ cành (`lib/data/scrap-tips.ts` + `components/ScrapTip.tsx` + tab toggle trong `app/page.tsx`). *Plan 5.3 — hook viral chi phí thấp.*
- [x] **add-to-garden-auth** — ✅ đã xong + archive 2026-08-18 (spec `user-auth` trong main specs). Clerk `@clerk/nextjs@7.7.7`: `proxy.ts` gate `/api/garden*` 401 · sign-in/sign-up · `AddToGardenButton` (redirect + return path) · UserButton/SignIn+SignUp trên header. Keys đã lưu `.env.local` (keyless `ins_3I53pueBiDZFU3V7uZFL6PNgJee`). *Còn lại nhỏ: user tự test sign-out bằng browser (task 3.4).*
- [x] **my-garden** — ✅ đã xong + archive 2026-08-18 (spec `my-garden` trong main specs). `lib/garden/` (store file-based, never-delete) · API CRUD auth (401/400/404/409) · Ghost Plant (died_at + cause ☀️/🐛/🌊/❓) · nudge data moat trong explanation (không đổi engine, 21/21 giữ nguyên) · trang `/garden` + AddToGardenButton gọi API thật. Tests 47/47.
- [x] **deterministic-first-aid** — ✅ đã xong + archive 2026-08-18 (spec `first-aid` trong main specs). 6 triệu chứng phân nhánh luật cứng → diagnosis + remedy từng bước; `/first-aid` client-side không login; entry "🆘 Cây có vấn đề?" trên crop detail. Tests 58/58.
- [ ] ~~**pwa-support**~~ — ⏸ **DEFERRED** (2026-08-18): manifest + SW offline shell. *User quyết định hoãn, ưu tiên retention; artifacts giữ nguyên (status note trong proposal.md).*

## Phase 1.5 — Retention (plan mục 6)

- [ ] My Garden cơ bản + trạng thái **Ghost Plant** (`died_at`, `cause` — ☀️ nắng gắt / 🐛 sâu bệnh / 🌊 úng nước / ❓) — nguồn Data Moat
- [ ] Đăng nhập khi bấm "Thêm vào vườn" (hiện là placeholder toast)
- [x] ~~Passive Tracker~~ ✅ implement trong `garden-progress` (progress bar + milestone badges)
- [x] ~~Emotional milestone~~ ✅ implement trong `garden-progress` (🌱 Nảy mầm / 🌿 Lớn lên / 🎉 Sắp thu hoạch)
- [x] ~~Harvest Brag Card~~ ✅ đã archive (toggle ẩn/hiện, copy to clipboard)
- [x] ~~Deterministic First Aid~~ ✅ đã archive (6 triệu chứng luật cứng)
- [x] ~~Programmatic SEO~~ — BỎ (app mobile, không cần)

## Phase 2 — Intelligence & Premium (plan mục 7)

- [x] ~~Swap weather API thật~~ ✅ đã archive (`OpenMeteoWeatherProvider` — free, no key, cache 1h, fallback dummy)
- [x] ~~AI explanation layer~~ ✅ đã archive (gpt-4o-mini, fallback template, cache 5 phút)
- [ ] Ask Community (khi đủ user density)
- [ ] Monetization hybrid freemium (Momо/ZaloPay, giới hạn 3 cây free)

## Phase 3 — Commerce (plan mục 8)

- [ ] Test affiliate Shopee/Lazada/TikTok Shop thực tế TRƯỚC khi thiết kế UI
- [ ] Seed/supply link location-aware

## Nợ kỹ thuật / ghi chú

- [ ] Expert review 15 crop profiles hiện tại (confidence medium/low) trước production
- [ ] Bổ sung `spacing` vào schema khi có dữ liệu
- [ ] Cân nhắc PWA icons PNG đa kích thước cho iOS (hiện SVG tối giản)
