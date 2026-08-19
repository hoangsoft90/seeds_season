## 1. Nội dung tips

- [x] 1.1 Tạo `lib/data/scrap-tips.ts`: chọn cây có tag `regrow_from_scraps` / `regrow_from_cuttings` từ `getAllCrops()`
- [x] 1.2 Viết hướng dẫn từng bước cho hành lá (gốc hành mua ở chợ) và rau muống (cắt cành)

## 2. Tab UI

- [x] 2.1 Thêm tab "Mẹo vặt" vào trang chủ, tách biệt khỏi recommendation sections
- [x] 2.2 Component `ScrapTip` hiển thị tip (icon, tên cây, các bước)
- [x] 2.3 Kiểm tra responsive mobile (grid 1 cột)

## 3. Kiểm chứng

- [x] 3.1 `npx tsc --noEmit` + `npm run lint`
- [x] 3.2 `npm test` (21/21 — engine không đổi)
- [x] 3.3 `npm run build`
