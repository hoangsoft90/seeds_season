## Why

Plan mục 5.1: *"Không yêu cầu tạo tài khoản để xem gợi ý. Chỉ yêu cầu đăng nhập khi user bấm 'Thêm vào vườn của tôi'."* Hiện nút đó là placeholder toast. Auth là nền tảng cho Phase 1.5 retention (My Garden per-user, Ghost Plant data moat) — phải có user identity trước khi lưu bất kỳ dữ liệu cá nhân nào.

## What Changes

- Đăng nhập/đăng ký (provider chọn trong design.md — đề xuất Clerk hoặc Better Auth).
- Session cookie-based; toàn bộ trang xem gợi ý / crop detail / mẹo vặt vẫn **public** (không ép login).
- Chỉ bảo vệ: hành động "Thêm vào vườn" + API garden (`/api/garden*`).
- Nút "Thêm vào vườn": chưa login → redirect/prompt sign-in; đã login → thêm thật.
- Trạng thái đăng nhập hiển thị nhẹ (avatar/email + nút đăng xuất) trên trang chủ.

## Capabilities

### New Capabilities
- `user-auth`: đăng nhập/đăng ký/đăng xuất, session, bảo vệ route theo nhu cầu

### Modified Capabilities
- `onboarding`: add-to-garden placeholder → hành động thật có auth-gate

## Impact

- Provider SDK (Clerk: `@clerk/nextjs` + `middleware.ts` + `app/sign-in|sign-up`; Better Auth: `better-auth` + schema + client)
- `components/AddToGardenButton.tsx` (mới) hoặc sửa `CropCard` — auth-gate trước khi gọi API garden
- `app/page.tsx`: hiển thị trạng thái login
- KHÔNG đụng `lib/recommendation-engine/*`; API recommendations vẫn public.
