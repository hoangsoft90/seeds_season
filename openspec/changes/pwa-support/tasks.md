## 1. Manifest

- [ ] 1.1 Tạo `app/manifest.ts` (MetadataRoute.Manifest): name, short_name, theme/background color, icons
- [ ] 1.2 Thêm icon SVG tối giản vào `public/`

## 2. Service worker

- [ ] 2.1 Viết `public/sw.js`: cache-first cho app shell (HTML/JS/CSS tĩnh), network-first cho `/api/recommendations`
- [ ] 2.2 Đăng ký SW từ client (chỉ production/HTTPS), version cache + skipWaiting/clientsClaim

## 3. Kiểm chứng

- [ ] 3.1 `npm run build` + xác nhận `/manifest.webmanifest` trả JSON hợp lệ
- [ ] 3.2 Kiểm tra installable + offline shell (DevTools Application / Lighthouse)
- [ ] 3.3 `npx tsc --noEmit` + `npm run lint` + `npm test`
