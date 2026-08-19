# .project/ — Knowledge Items

Bộ Knowledge Items (KI) tóm tắt toàn bộ project **"Trồng gì hôm nay?"** — app gợi ý trồng rau/củ/quả theo mùa & vị trí cho người mới trồng ban công ở Việt Nam.

> Mục đích: để bất kỳ agent (hoặc developer) nào vào project cũng nắm được kiến trúc, quyết định quan trọng và trạng thái hiện tại mà không cần đọc lại toàn bộ code. **Đọc README này trước.**

## Bảng mục lục

| File | Nội dung |
|---|---|
| [overview.md](overview.md) | Project là gì, North Star, persona, tech stack, trạng thái tổng quan |
| [architecture.md](architecture.md) | Kiến trúc hệ thống: cấu trúc thư mục, luồng dữ liệu, pipeline engine |
| [patterns.md](patterns.md) | Quy ước & pattern: Schema v2, hard constraints vs scoring, testing, naming |
| [state.md](state.md) | Trạng thái hiện tại: đã làm gì, test 21/21, vấn đề mở, lưu ý môi trường |
| [roadmap.md](roadmap.md) | Todo list: 3 openspec changes sẵn sàng + các phase tiếp theo (1.5 → 3) |
| [ai-rules.md](ai-rules.md) | Luật cho agent khi code tiếp — **bắt buộc đọc trước khi sửa engine** |
| [modules/](modules/) | Chi tiết từng module: engine, data, api, ui, testing |

## Nguồn tham chiếu chính (root)

- `plan1_final_v2.md` — bản kế hoạch chiến lược + kiến trúc sản phẩm (nguồn sự thật cho sản phẩm)
- `crops_data.json` — dữ liệu 15 cây theo Schema v2
- `golden_test_cases.json` — 20 Golden Test Cases (regression suite)
- `openspec/` — specs + change proposals theo OpenSpec (spec-driven)
- `AGENTS.md` — lưu ý Next.js 16 (breaking changes so với training data)
