## Context

Xem `proposal.md` — Why. App là Next.js 16 App Router, client components, chưa có auth hay storage per-user. Requirement bắt buộc: xem gợi ý KHÔNG cần login; chỉ "Thêm vào vườn" + API garden cần auth (plan 5.1).

## Goals / Non-Goals

- **Goals**: sign in/up, session cookie, auth-gate cho add-to-garden + `/api/garden*`, sign out, hiển thị trạng thái login.
- **Non-Goals**: OAuth đầy đủ nhiều provider (có thể thêm sau), MFA, role/permission phức tạp, admin panel, social login mặc định cho MVP.

## Đã chốt (cập nhật sau khi code)

- **Provider**: Clerk (`@clerk/nextjs@7.7.7`) — đã cài + verify keyless mode (home/sign-in 200, `/api/garden/*` trả 401 đúng message).
- **Clerk v7 Core 3**: `<SignedIn>/<SignedOut>` không còn — dùng `<Show when="signed-in|signed-out">`; `redirectToSignIn` nằm trên `useClerk()`; `UserButton` không nhận `afterSignOutUrl` (mặc định sign out về `/`).
- **Middleware**: `createRouteMatcher` bị deprecate trong v7 (khuyến nghị check auth trong route handler). Giữ middleware làm gate 401 cho toàn namespace `/api/garden*` ở change này; khi code change `my-garden`, mỗi route handler sẽ tự check `auth()` (defense in depth) — có thể bỏ middleware lúc đó nếu muốn.
- **Keys**: đã dán vào `.env.local` (keyless instance `ins_3I53pueBiDZFU3V7uZFL6PNgJee`) — `clerk doctor` ✓. `clerk auth login`/`clerk init` không chạy được trong sandbox (OAuth callback localhost), nên keys lấy từ Dashboard thay vì CLI.
- **Next 16**: `middleware.ts` đã migrate thành `proxy.ts` (deprecated). Matcher có `'/__clerk/:path*'` sau `'/(api|trpc)(.*)'`.

## Decisions

- **Provider — ✅ ĐÃ CHỐT: Clerk** (`@clerk/nextjs`) — user chọn 2026-08-18. Gravity khuyến nghị: pre-built UI (SignIn/SignUp), session cookie tự động, free tier hào phóng, tích hợp App Router nhanh. Cần env vars `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` từ dashboard Clerk (user tạo tài khoản — xem `openspec/changes/add-to-garden-auth` setup). Better Auth là alternative nếu đổi ý.
- **Bảo vệ route**: chỉ protect `/api/garden*` + hành động add-to-garden; mọi trang khác public (đúng plan 5.1).
- **Return path**: khi anonymous bị chặn ở add-to-garden → redirect sign-in kèm `redirect_url` về trang hiện tại để không phá flow.
- **Storage per-user**: auth provider cấp user id; garden store key theo `user_id` (file-based MVP, xem change `my-garden`).

## Risks / Trade-offs

- [Dependency cloud (Clerk) → vendor lock-in + cần tài khoản] → Better Auth alternative tự-host; quyết định này phải user chốt.
- [Auth làm trễ MVP core] → Chỉ gate đúng 2 điểm (button + API garden), không đụng recommendation flow.
- [Env vars bí mật trong CI] → Thêm vào GitHub secrets, không commit `.env.local`.

## Open Questions

-(đã chốt Clerk)
