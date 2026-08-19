## 1. Trang chi tiết cây

- [x] 1.1 Tạo `app/crops/[id]/page.tsx` (server component) + `generateStaticParams` từ `getAllCrops()`
- [x] 1.2 Render sections: thời vụ theo vùng (planting_windows + anomaly flags), điều kiện tối ưu (temp/sun/water/soil), độ sâu chậu + lý do hard constraints
- [x] 1.3 Render growth timeline từ `timeline_base.growth_stages` + khoảng ngày thu hoạch
- [x] 1.4 Hiển thị `beginner_success_factors.notes` + notice khi source confidence = low
- [x] 1.5 `notFound()` cho id không tồn tại (`dynamicParams = false`)

## 2. Điều hướng

- [x] 2.1 `CropCard`: bọc tên cây thành `Link` → `/crops/[id]` (+ link "Xem cách trồng →")
- [x] 2.2 Kiểm tra layout desktop + mobile viewport (max-w-2xl, grid responsive)

## 3. Kiểm chứng

- [x] 3.1 `npx tsc --noEmit` + `npm run lint` (sạch)
- [x] 3.2 `npm test` (21/21 — engine không đổi)
- [x] 3.3 `npm run build` (15 trang `/crops/[id]` prerender SSG) + e2e: `/crops/cai_xanh` 200 đủ sections, `/crops/unknown` 404
