## Why

Plan mục 6 (Phase 1.5 — Retention): **My Garden cơ bản + trạng thái "Ghost Plant"**. Hiện "Thêm vào vườn" chỉ là placeholder toast. My Garden là vòng giữ chân đầu tiên sau First Successful Grow: user theo dõi cây đang trồng, và khi cây chết KHÔNG xóa dữ liệu — chuyển sang Ghost lưu `died_at` + `cause`. Đây là nguồn **Data Moat quan trọng nhất** của sản phẩm: dữ liệu thất bại cá nhân hoá ("Lần trước bạn trồng Cải xanh tháng 7 và thất bại vì nắng gắt. Tháng này thử Mồng tơi nhé!") mà đối thủ khó copy.

## What Changes

- **Thêm cây vào vườn thật** (thay placeholder toast) — cần user đăng nhập (change `add-to-garden-auth` là dependency).
- **My Garden**: danh sách cây đang theo dõi (crop, ngày trồng, trạng thái), thêm/xoá theo dõi.
- **Ghost Plant**: khi user đánh dấu cây "chết"/bỏ theo dõi → KHÔNG xóa bản ghi, chuyển sang trạng thái ghost với `died_at` + `cause` chọn nhanh: ☀️ Nắng gắt/héo · 🐛 Sâu bệnh · 🌊 Úng nước · ❓ Không rõ.
- Storage per-user (file/SQLite — xem design.md; Postgres sau này), API CRUD garden.
- Gợi ý cá nhân hoá theo lịch sử thất bại ("tháng này thử Mồng tơi") — phase nhỏ trong change này, có thể cắt nếu scope quá rộng.

## Capabilities

### New Capabilities
- `my-garden`: theo dõi cây trồng + trạng thái Ghost Plant (died_at, cause)

### Modified Capabilities
- `onboarding`: hành động "add to garden" chuyển từ placeholder sang thật (phụ thuộc auth)

## Impact

- `lib/garden/` (mới): storage + service logic
- `app/api/garden/route.ts` (mới): POST (thêm), GET (danh sách) — yêu cầu auth
- `app/api/garden/[id]/route.ts` (mới): PATCH (đánh dấu ghost + cause / cập nhật), DELETE (xoá theo dõi → ghost)
- `app/garden/page.tsx` (mới): My Garden UI
- `components/CropCard.tsx`, `app/page.tsx`: "Thêm vào vườn" gọi API thật (sau khi auth)
- KHÔNG đụng `lib/recommendation-engine/*` (trừ khi làm gợi ý cá nhân hoá — sẽ tách riêng nếu cần).
