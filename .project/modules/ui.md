# Module: UI

Đường dẫn: `app/page.tsx`, `app/layout.tsx`, `components/CropCard.tsx`.

## Trang chủ — Onboarding zero-friction (plan 5.1-5.2)

Client component duy nhất quản lý state flow:

1. **📍 Bước 1 — Vị trí**: chọn thành phố (Hà Nội → north, TP.HCM → south, Đà Lạt → highland) hoặc 📡 GPS → tìm vùng gần nhất theo tọa độ (không lưu tọa độ). GPS fail → hướng dẫn chọn tay.
   - Sau bước 1 → gọi API với default `{balcony, 3h nắng, chậu 15cm}` → **🌍 Level 1 "Good for your area"**.
2. **🎯 Bước 2 — Goal (tùy chọn)**: ⚡ fastest / 🌿 easy_care / 🍅 daily_food — có thể bỏ qua. Đổi goal sau khi đã chọn micro-climate → tính lại Level 2.
3. **🪴 Bước 3 — Micro-climate proxy** (3 icon):
   - 🏢 Cửa sổ ban công → `window`, 2h nắng, chậu 12cm
   - 🏠 Sân thượng/ban công rộng → `balcony`, 4h, chậu 20cm
   - 🌳 Sân vườn đất → `garden`, 7h, pot `null`
   - Sau bước 3 → **🪴 Level 2 "Best for your balcony"** (context đầy đủ + goal).

## CropCard

- Tên + tên khoa học + badge role ("🌱 Dễ trồng" / "🍅 Bước lên") + tags (category, ngày thu hoạch, score/100) + "Why" + nút "+ Thêm vào vườn".
- Add-to-garden = **placeholder** (toast "My Garden ra mắt ở Phase 1.5") — chưa có auth.
- (Roadmap: bọc tên cây thành Link → `/crops/[id]` — change `crop-detail-pages`.)

## Crop detail (`app/crops/[id]/page.tsx` — đã xong, change crop-detail-pages)

- Server component + SSG: `generateStaticParams` từ `getAllCrops()` → 15 trang tĩnh; `dynamicParams = false` → id lạ trả 404 (`notFound()`).
- Sections: 📅 Thời vụ theo vùng (planting_windows + anomaly flags + source/confidence) · 🌡️ Điều kiện lý tưởng (temp/sun/water/soil) · 🪴 Chậu & giới hạn quan trọng (pot depth + temp death reasons) · ⏱️ Timeline (germination/thu hoạch + growth stages) · 🌱 Dành cho người mới (forgiveness/disease + notes).
- Notice ⚠️ "ít dữ liệu địa phương" khi có source confidence = low (data moat — khuyến khích báo cáo).
- Vùng không có regional_rules (highland) → ghi chú "dùng logic nhiệt độ chung".
- `lib/labels.ts` — label VN dùng chung (category/difficulty/water/soil/region/window type); `CropCard` import từ đây.

## Tab "Mẹo vặt" (change kitchen-scraps-tips — đã archive)

- Tab toggle trong `app/page.tsx`: **"🌱 Gợi ý trồng gì"** (mặc định) / **"🧑‍🍳 Mẹo vặt"** — `useState<Tab>`; content hoán đổi, recommendation luôn là mặc định (plan 5.3: không làm lu mờ USP).
- `lib/data/scrap-tips.ts`: `getScrapTips()` — chọn cây có tag `regrow_from_scraps` / `regrow_from_cuttings` từ `getAllCrops()` (hiện có hanh_la, rau_muong) + hướng dẫn 5 bước viết tay (CURATED_STEPS). Thêm tip mới = thêm crop có tag + entry trong CURATED_STEPS/ICONS/SUMMARIES.
- `components/ScrapTip.tsx`: card icon + tên (Link → `/crops/[id]`) + badge method + summary + các bước 1-2-3 + ngày thu hoạch. Nội dung tĩnh client-side (dữ liệu JSON bundle vào client chunk — đã verify).

## Trạng thái UI

- Loading: "Đang tính toán…"; error: message đỏ từ API; NO_MATCH: warning panel amber.
- Toast thông báo bottom-fixed (tạm thời).

## Layout & styling

- `app/layout.tsx`: `lang="vi"`, metadata tiếng Việt, **system font stack** (Google Fonts bị chặn trong môi trường dev — đừng bật lại `next/font/google` trừ khi chắc chắn mạng OK).
- Tailwind v4 (`app/globals.css`), mobile-first: `max-w-2xl`, grid 1 cột mobile → 3 cột desktop cho icon micro-climate.
- Dark-mode classes của scaffold vẫn còn trong globals nhưng UI hiện dùng light theme.

## API contract từ UI

`fetch("/api/recommendations", { method: "POST", body: JSON.stringify(ctx) })` — response type `ApiResponse` trong `app/page.tsx`; `ApiRecommendation` trong `CropCard.tsx`.
