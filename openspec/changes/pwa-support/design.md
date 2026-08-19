## Context

Xem `proposal.md` — Why. App hiện là Next.js App Router: home tĩnh (SSR) + 1 API route động. Chạy `npm run dev`/`npm run build`.

## Goals / Non-Goals

- **Goals**: manifest hợp lệ + SW cache shell, installable, offline shell cơ bản.
- **Non-Goals**: offline đầy đủ cho recommendations (vẫn cần network — context cá nhân hoá), push notification, background sync, tối ưu icon đa kích thước.

## Decisions

- **Manifest**: `app/manifest.ts` (Next.js `MetadataRoute.Manifest`) — name "Trồng gì hôm nay?", theme emerald, icon SVG trong `public/`.
- **SW thủ công thay vì `next-pwa`**: viết `public/sw.js` ngắn (precache shell với `CACHE_NAME` version; cache-first cho static, network-first cho `/api/recommendations`; `skipWaiting` + `clientsClaim`). Tránh thêm dependency; đủ cho MVP.
- **Đăng ký SW**: client-only, chỉ production (`process.env.NODE_ENV === "production"`) để không gây nhiễu dev; đăng ký trong `app/page.tsx` (effect) hoặc một `components/ServiceWorkerRegister.tsx`.

## Risks / Trade-offs

- [SW phục vụ bản cũ sau deploy] → Version cache + `skipWaiting`/`clientsClaim`; trang chính network-first để luôn nhận bản mới.
- [Icon thiếu kích thước chuẩn cho iOS] → Chấp nhận SVG tối giản cho MVP; bổ sung PNG sau nếu cần App Store-like trải nghiệm.

## Open Questions

- (không)
