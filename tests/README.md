# tests

Unit tests — **Bước 5** (chưa implement ở Bước 1).

- `golden.test.ts` — chạy toàn bộ 20 Golden Test Cases (`golden_test_cases.json`) như regression suite.
- Runner: Vitest (hoặc Jest) + CI qua GitHub Actions.

**Quy tắc:** nếu engine thay đổi, toàn bộ case này PHẢI pass. Không sửa test case để nó pass — sửa logic engine.
