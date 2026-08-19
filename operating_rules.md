# operating_rules.md — Quy tắc vận hành

> Các quy tắc làm việc cho agent (và dev) khi code trong project này. Bất biến của ENGINE chi tiết hơn ở `.project/ai-rules.md`; file này là bản rút gọn thao tác hằng ngày.

## 1. Verify trước khi khẳng định

- Chỉ báo "xong/pass" khi **có output chạy thực tế**: `npm test` (21/21), `npx tsc --noEmit`, `npm run lint`, `npm run build` (nếu đụng UI/API).
- Đụng engine/API → chạy cả `npm test` lẫn `tsc`.
- Không nói "chắc là chạy được" — chạy rồi mới nói.

## 2. Golden Test Cases

- `tests/golden.test.ts` chạy 20 case từ `golden_test_cases.json` — **regression suite bắt buộc**.
- **KHÔNG sửa test để nó pass** → sửa logic engine, hoặc báo user khi test case có vấn đề logic.
- Mọi sửa đổi `golden_test_cases.json` cần lý do rõ ràng + được user duyệt.
- TC20: 2 mùa cho kết quả giống nhau = lỗi nghiêm trọng (engine bỏ Season_Fit).

## 3. Bất biến engine (không refactor nhầm)

1. **Hard Constraints ≠ Scoring**: loại trừ tuyệt đối TRƯỚC (temp chết / nắng tối thiểu / độ sâu chậu). Không weighted-average "cứu" cây vượt ngưỡng chết.
2. **Season = scoring** (trái mùa → điểm thấp), không phải hard exclude.
3. **Step-up chọn riêng khỏi ranking**: Top 3 = 2 easy + cây quả tốt nhất còn sống sót; chỉ fallback cây easy thứ 3 khi không còn cây quả nào.
4. Candidates rỗng → **NO_MATCH_STATE**, không ép danh sách.
5. **Weather abstraction**: engine chỉ dùng `context.weather` (optional) / dummy theo mùa; Phase 2 swap `WeatherProvider`, không refactor engine.
6. `community_fail_rate_override` = penalty điểm, **không** hard exclude.
7. Audit mode (dev-only) — không expose qua API public.

## 4. Dữ liệu

- Không sửa `crops_data.json` tùy tiện: đổi số liệu → cập nhật `reason`/`source`/provenance; giữ đủ 4 nhóm (validateDataset sẽ fail nếu thiếu).
- Không lưu tọa độ GPS chính xác (Nghị định 13/2023) — chỉ cấp vùng.
- Confidence `low` → UI phải có notice (đừng xoá).

## 5. Quy trình

- **OpenSpec trước khi code lớn**: thay đổi behavior → tạo/sửa change trong `openspec/changes/` (proposal → specs → design → tasks), `openspec validate --all` phải 6/6, rồi mới code. Sau khi code xong → `openspec archive <id>`.
- **Không đổi stack giữa chừng** (Next.js/TS/Tailwind/Vitest). Muốn đổi → đề xuất lý do rõ ràng trước.
- Không cài dependency mới nếu chưa cần; ưu tiên giải pháp đơn giản, stdlib/native.
- **Không push / deploy** khi chưa được yêu cầu. Commit chỉ khi user yêu cầu.
- Không chạy lệnh có tác động ngoài project (cài global, sửa hệ thống) khi chưa được phép.

## 6. Môi trường dev (đã biết)

- Google Fonts bị chặn → system font stack (đừng bật lại `next/font/google`).
- Dev server chạy nền sẽ chết giữa phiên → e2e trong 1 lệnh: `(npm run dev &); sleep 8; curl ...; pkill -f "next dev"`.
- Node 24 local / Node 22 CI; package manager = **npm**.

## 7. Ngôn ngữ & phong cách

- UI, explanation, comment: **tiếng Việt** (code identifier vẫn tiếng Anh).
- UI mobile-first; không phá layout 2 tầng (Level 1 🌍 / Level 2 🪴) và luồng onboarding.
- Comment giải thích "vì sao" ở những chỗ bất biến (hard constraints, step-up, season) — giữ nguyên.
