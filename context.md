# context.md — Ngữ cảnh project

> Đọc file này trước tiên khi mở lại project (1 phút). Chi tiết: `.project/`.

## Project là gì

**"Trồng gì hôm nay?"** — app web gợi ý trồng rau/củ/quả theo mùa & vị trí cho **người mới trồng ban công ở đô thị Việt Nam**. User chọn vị trí (thành phố/GPS) → mục tiêu (tùy chọn) → micro-climate (3 icon) → nhận ngay **Top 3 cây nên trồng** + giải thích "Why", không cần đăng ký.

**North Star: First Successful Grow** — câu hỏi cốt lõi là *"Cây nào tôi có khả năng trồng THÀNH CÔNG nhất ngay bây giờ?"*, không phải *"Cây nào phù hợp khí hậu của tôi?"*. Personal gardening assistant, không phải gardening database.

**Persona:** người mới tuyệt đối; mục tiêu "trồng được thứ gì đó và không làm nó chết".

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict) + **Tailwind CSS v4**
- **Vitest** — Golden Test Cases (21 test) như regression suite; CI: GitHub Actions
- **DB:** chưa có — file-based `crops_data.json` (Schema v2); kế hoạch migrate PostgreSQL JSON columns
- Node 24 (dev) / Node 22 (CI)

## Nguồn sự thật (root)

| File | Vai trò |
|---|---|
| `plan1_final_v2.md` | Kế hoạch chiến lược + kiến trúc + thuật toán (mục 4.2 schema, 4.3 pipeline, 5.1-5.2 onboarding, 5.4 no-match) |
| `crops_data.json` | 15 cây theo Schema v2 (4 nhóm: crop_base / hard_constraints / growing_rules+regional_rules / beginner_success_factors) |
| `golden_test_cases.json` | 20 Golden Test Cases TC01–TC20 (regression suite bắt buộc) |
| `openspec/` | 3 specs + 3 change proposals (validate 6/6) |
| `.project/` | Knowledge Items: kiến trúc, pattern, state, roadmap, ai-rules |
| `AGENTS.md` / `CLAUDE.md` | Memory cho agent |

## Trạng thái 1 dòng

MVP 7 bước **hoàn thành**: engine + weather abstraction + audit mode + **21/21 golden tests pass** + API `POST /api/recommendations` + UI onboarding 2 tầng (Level 1 🌍 / Level 2 🪴). Tiếp theo: 3 change proposals sẵn sàng trong `openspec/changes/` (crop-detail-pages, kitchen-scraps-tips, pwa-support) — xem `working.md`.

## Sơ đồ nhanh

```
Browser → POST /api/recommendations (Next.js route, validate)
        → lib/recommendation-engine/ (engine, scoring, weather, audit, types)
        → lib/data/crops.ts → crops_data.json
```

Chi tiết kiến trúc: `.project/architecture.md` và `.project/modules/`.
