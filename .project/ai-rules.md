# AI Rules — Luật cho agent khi code tiếp

> Đọc kỹ trước khi sửa bất kỳ code nào. Các quy tắc này bảo vệ những quyết định đã được review kỹ (6 vòng) và được user xác nhận.

## 1. Đọc trước khi code

- Đọc `plan1_final_v2.md`, `crops_data.json`, `golden_test_cases.json` trước khi đụng engine.
- Đọc `.project/state.md` để biết quyết định đã chốt — **đừng revert những gì đã sửa** (danh sách ở mục "Lịch sử quyết định sửa engine").
- Đọc `AGENTS.md` (root) — Next.js 16 có breaking changes so với training data; xem docs trong `node_modules/next/dist/docs/` nếu cần.

## 2. Bất biến của engine (KHÔNG refactor nhầm)

- **Hard Constraints tách khỏi Scoring**: bộ lọc loại trừ tuyệt đối chạy TRƯỚC. Không dùng weighted average để "cứu" cây vượt ngưỡng chết.
- **Season = scoring, không phải hard exclude** (căn cứ TC04/TC14). Cây trái mùa bị hạ rank, không bị loại cứng.
- **Step-up chọn RIÊNG khỏi ranking**: slot 3 = cây quả tốt nhất còn sống sót (2 easy + 1 step-up). Đừng đổi lại thành "top 3 theo điểm thuần túy".
- **NO_MATCH_STATE**: candidates rỗng → trả NO_MATCH, không ép danh sách.
- **Weather abstraction**: engine không gọi weather API trực tiếp; chỉ dùng `context.weather` (optional) hoặc dummy provider. Phase 2 swap provider, không refactor engine.
- **Confidence low** → UI phải có notice (đừng xoá).

## 3. Golden Test Cases

- `npm test` phải pass **21/21** trước khi báo "xong".
- **KHÔNG sửa test case để nó pass** — sửa logic engine, hoặc báo user nếu test case có vấn đề logic.
- Mọi sửa đổi `golden_test_cases.json` phải có lý do rõ ràng và được user duyệt.
- TC20 (chuyển mùa) giống nhau giữa 2 input = lỗi nghiêm trọng (engine bỏ qua Season_Fit).

## 4. Dữ liệu

- Không sửa `crops_data.json` một cách tùy tiện: mọi field đều có `data_provenance`/`source`; nếu đổi số liệu, cập nhật luôn reason/source.
- `validateDataset` sẽ ném lỗi nếu thiếu 1 trong 4 nhóm — đừng phá schema.
- Không lưu tọa độ GPS chính xác (Nghị định 13/2023) — chỉ lưu cấp vùng.

## 5. Quy trình làm việc

- **Verify trước khi khẳng định**: chạy `npm test`, `npx tsc --noEmit`, `npm run lint` (và `npm run build` khi đụng UI) — chỉ báo thành công khi có output pass.
- Thay đổi lớn → đề xuất qua OpenSpec (`openspec/changes/`) trước khi code.
- Không đổi stack giữa chừng (Next.js/TS/Tailwind/Vitest) — nếu muốn đổi, đề xuất lý do rõ ràng trước.
- Không cài dependency mới mà không cần thiết; ưu tiên giải pháp đơn giản.
- UI: tiếng Việt, mobile-first, không phụ thuộc Google Fonts (mạng dev bị chặn).

## 6. Phạm vi hiện tại (chưa làm)

- Không implement trong vòng này: My Garden đầy đủ, Widget, affiliate/marketplace, weather API thật, AI explanation, auth đầy đủ (chỉ placeholder "Thêm vào vườn").
- Các tính năng này thuộc Phase 1.5+ — xem `roadmap.md`.
