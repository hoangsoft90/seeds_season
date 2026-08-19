# Module: Testing & CI

## Runner: Vitest

- Cấu hình mặc định (không cần file config riêng; TS + JSON import hoạt động qua Vite transform).
- Scripts: `npm test` (vitest run), `npm run test:watch`.
- Chỉ có 1 test file hiện tại: `tests/golden.test.ts`.

## Golden Test Cases (`tests/golden.test.ts`)

- Nguồn: `golden_test_cases.json` — **20 case TC01–TC20** (regression suite bắt buộc, plan 4.4).
- Load data: `getAllCrops()` từ data layer (validateDataset chạy ngầm).
- Kiểu assertion:
  - `must_include` → id phải có trong Top 3 (không cần đúng thứ tự)
  - `must_exclude` → id không được trong Top 3
  - `must_include_fruit_vegetable: true` → Top 3 có ≥1 cây `category === "fruit_vegetable"` (assert step-up)
  - TC15 → `status === "no_match"`
  - TC20 → 2 input (tháng 7 vs 11) có Top 3 khác nhau đáng kể (≤1 cây trùng) — nếu giống = engine bỏ qua Season_Fit
- Thêm test "dataset chứa đủ 20 case" → tổng **21 test**.
- Helper `formatBrief(result)` in Top3 + điểm components + next-best để debug nhanh khi fail.

## CI — GitHub Actions (`.github/workflows/ci.yml`)

```
push/PR → setup-node 22 (cache npm) → npm ci
  → npx tsc --noEmit
  → npm test          (golden suite = regression)
  → npm run lint
  → npm run build
```

## Quy tắc

- **KHÔNG sửa test để nó pass** — sửa engine, hoặc báo user khi test case có vấn đề logic (đã xảy ra: 6 case conflict, user duyệt sửa test data + đổi assertion sang `must_include_fruit_vegetable`).
- Engine đổi → chạy lại toàn bộ suite (`npm test`), không chỉ test liên quan.
- Báo "pass" chỉ khi có output `21 passed`.

## Audit CLI (dev-only)

- `npx tsx scripts/audit.ts` — chạy audit mode cho 4 context mẫu (TC01, TC02, TC07, TC15) — in điểm từng component + lý do exclude.
- Không phải user-facing (plan 5.6).
