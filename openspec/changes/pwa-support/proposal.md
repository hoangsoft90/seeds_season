> **STATUS: DEFERRED (2026-08-18)** — user quyết định hoãn, ưu tiên Phase 1.5 retention (auth + My Garden + First Aid). Giữ nguyên artifacts; khi quay lại chỉ cần bỏ dòng này.

## Why

Yêu cầu từ task gốc: "Ưu tiên PWA-ready để chạy tốt trên mobile qua trình duyệt trước khi cân nhắc native app". Manifest + service worker giúp app installable và mở nhanh/offline cơ bản trên mobile — chi phí thấp, đúng giai đoạn MVP.

## What Changes

- Web app manifest (name, short name, theme color, icons) — installable trên mobile.
- Service worker cache app shell (HTML + static assets) — mở lại nhanh, hoạt động offline cơ bản sau lần truy cập đầu.
- `/api/recommendations` KHÔNG cache (dữ liệu cá nhân hoá theo context) — network-first.

## Capabilities

### New Capabilities
- `pwa-support`: manifest + service worker cho installable/offline shell

### Modified Capabilities
- (không)

## Impact

- `app/manifest.ts` (mới), `public/sw.js` (mới), `public/icon.svg` (mới), đăng ký SW ở client
- Không đụng engine/API.
