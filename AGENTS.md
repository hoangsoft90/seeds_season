<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- ============================================================
     Project memory — "Trồng gì hôm nay?" (seeds-season)
     Phần này do dev viết, next dev KHÔNG quản lý.
     ============================================================ -->

# Trồng gì hôm nay? — project memory

Ứng dụng gợi ý trồng rau/củ/quả theo mùa & vị trí cho người mới trồng ban công ở Việt Nam.
North Star: **First Successful Grow** — "Cây nào tôi có khả năng trồng THÀNH CÔNG nhất ngay bây giờ?".

## Bắt đầu từ đâu (bắt buộc đọc trước khi code)

1. `context.md` — ngữ cảnh project trong 1 phút.
2. `working.md` — project đang ở đâu: việc vừa làm, việc tiếp theo, cách kiểm chứng.
3. `.project/README.md` — bảng mục lục Knowledge Items đầy đủ (kiến trúc, pattern, state, roadmap, ai-rules).
4. `plan1_final_v2.md` — kế hoạch sản phẩm + thuật toán (nguồn sự thật).
5. `openspec/` — specs + change proposals (đã validate 6/6).

## Các lệnh nhanh

```bash
npm test           # 21/21 golden tests (bắt buộc pass trước khi báo xong)
npx tsc --noEmit   # typecheck
npm run lint       # eslint
npm run build      # production build
npx tsx scripts/audit.ts   # audit mode (dev)
npx openspec validate --all  # openspec
```

## Bất biến engine (KHÔNG refactor nhầm — chi tiết: operating_rules.md)

- Hard Constraints **loại trừ tuyệt đối TRƯỚC** scoring; không weighted-average "cứu" cây vượt ngưỡng chết.
- Season = **scoring**, không phải hard exclude.
- Step-up (slot 3) = cây quả tốt nhất còn sống sót, chọn **riêng khỏi ranking** (2 easy + 1 step-up).
- Candidates rỗng → `NO_MATCH_STATE`, không ép danh sách.
- Weather: `context.weather` optional + dummy provider (Phase 2 swap thật, không refactor engine).
- **Không sửa test case để nó pass** — sửa engine hoặc báo user.
- Không sửa `crops_data.json` tùy tiện (mọi field có source/confidence/provenance).
- Không lưu tọa độ GPS (Nghị định 13/2023) — chỉ lưu cấp vùng.

## Lưu ý môi trường

- Google Fonts bị chặn trong dev → layout dùng system font stack (đừng bật lại `next/font/google`).
- Dev server chạy background sẽ chết giữa các phiên → test e2e trong 1 lệnh (start → curl → pkill).
