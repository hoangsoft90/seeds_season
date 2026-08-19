> Blocking decision: user phải chốt provider (Clerk hay Better Auth) trước task 1.x — ảnh hưởng toàn bộ phần còn lại.

## 0. Chốt provider

- [x] 0.1 User chọn: Clerk (`@clerk/nextjs`) — đã chốt (cloud, nhanh)

## 1. Cài đặt & cấu hình (theo provider đã chốt)

- [x] 1.1 Cài SDK + cấu hình env vars — `@clerk/nextjs@7.7.7` đã cài; **user đã lưu keys vào `.env.local`** (keyless instance `ins_3I53pueBiDZFU3V7uZFL6PNgJee`, `clerk doctor` ✓); `.env*` trong `.gitignore`
- [x] 1.2 Wrap app trong provider — `ClerkProvider` trong `<body>` (`app/layout.tsx`)
- [x] 1.3 Thiết lập bảo vệ route: chỉ `/api/garden*` + add-to-garden; mọi trang khác public — **`proxy.ts`** (đã migrate từ `middleware.ts` — Next 16 deprecated) trả 401 JSON; matcher có `'/(api|trpc)(.*)'` + `'/__clerk/:path*'` (theo hướng dẫn CLI)
- [x] 1.4 Trang sign-in / sign-up — `app/sign-in/[[...sign-in]]` + `app/sign-up/[[...sign-up]]` (component Clerk)

## 2. Auth-gate cho add-to-garden

- [x] 2.1 `components/AddToGardenButton.tsx`: chưa login → redirect sign-in kèm return path; đã login → gọi `onAdd`
- [x] 2.2 Trạng thái login trên trang chủ — `<Show when="signed-in">` UserButton / `<Show when="signed-out">` SignInButton + SignUpButton modal

## 3. Kiểm chứng

- [x] 3.1 Anonymous: home 200, sign-in 200, sign-up 200, add-to-garden → redirect sign-in (code path `redirectToSignIn`)
- [x] 3.2 Signed-in: **đã verify qua API với keys thật** (401 đúng khi chưa login); test sign-up/sign-in đầy đủ bằng browser — **user tự test thủ công** (bước "After Setup" của hướng dẫn CLI)
- [x] 3.3 Unauthenticated `POST /api/garden/add` → 401 `{"error":"Bạn cần đăng nhập để quản lý vườn."}` — verified với keys thật
- [ ] 3.4 Sign out → API garden trả 401 — **user tự test bằng browser** (UserButton sign out rồi gọi API)
- [x] 3.5 `npx tsc --noEmit` + `npm run lint` + `npm test` (21/21) + `npm run build` — tất cả sạch

## Ghi chú môi trường

- `clerk auth login` / `clerk init --app <id>` **không chạy được trong sandbox** (OAuth redirect về `127.0.0.1:<port>` trên máy user → 404; CLI cần browser cùng máy). Giải pháp: user dán keys từ Dashboard — đã xong.
- Next 16: `middleware.ts` → `proxy.ts` (đã migrate; build log: `ƒ Proxy (Middleware)`).
