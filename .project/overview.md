# Overview

## Project là gì

Ứng dụng web gợi ý trồng rau/củ/quả theo mùa và vị trí cho **người mới trồng ban công ở đô thị Việt Nam**. Người dùng chọn vị trí (thành phố/GPS), mục tiêu (tùy chọn), micro-climate (3 icon), và nhận ngay Top 3 cây nên trồng kèm giải thích "Why" — không cần đăng ký tài khoản.

**North Star: First Successful Grow** — "Cây nào tôi có khả năng trồng THÀNH CÔNG nhất ngay bây giờ?", không phải "Cây nào phù hợp khí hậu của tôi?" (plan mục 0.6). Đây là personal gardening assistant, không phải gardening database.

**Persona:** người mới tuyệt đối, mục tiêu là "trồng được thứ gì đó và không làm nó chết".

## Tech stack

- **Next.js 16.3.1** (App Router) + **React 19** + **TypeScript 5** (strict) + **Tailwind CSS v4**
- **Vitest** — Golden Test Cases chạy như regression suite trong CI (GitHub Actions)
- **Database:** chưa có — data file-based (`crops_data.json`); kế hoạch migrate PostgreSQL với JSON columns (plan 4.2)
- Local dev: Node 24 / npm 12; CI: Node 22 (`ci.yml`)

## Các mốc đã hoàn thành (xem chi tiết `state.md`)

1. Scaffold Next.js + TS + Tailwind, cấu trúc `lib/recommendation-engine/`, `lib/data/`, `tests/`
2. Data Model Schema v2 (4 nhóm tách rõ) + data layer file-based
3. Recommendation Engine (pipeline 4.3) + weather provider interface (dummy)
4. Recommendation Audit Mode (dev-only)
5. Golden Test Cases — **21/21 pass** + CI workflow
6. API `POST /api/recommendations` + explanation "Why" tiếng Việt
7. UI Onboarding + trang chủ 2 tầng (🌍 Level 1 / 🪴 Level 2)

## Định hướng sản phẩm (ngắn)

- **Phase 0.5** (đã xong về mặt kế hoạch): validation qua Zalo OA bot — ngoài scope code hiện tại
- **Phase 0** (đã code): data ontology + core engine
- **Phase 1** (đã code): MVP onboarding + Top 3 + API
- **Phase 1.5+**: My Garden (ghost plant, fail cause), Widget, Deterministic First Aid, AI explanation, weather API thật, commerce affiliate (xem `roadmap.md`)
