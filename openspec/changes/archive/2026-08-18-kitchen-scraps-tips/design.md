## Context

Xem `proposal.md` — Why. Trang chủ là một client component duy nhất (`app/page.tsx`) quản lý onboarding + 2 tầng recommendation.

## Goals / Non-Goals

- **Goals**: nội dung tĩnh, không gọi API, không cần server.
- **Non-Goals**: theo dõi cây regrow (My Garden Phase 1.5), notification, ảnh user upload.

## Decisions

- **Tab là toggle UI**: `useState` trong `app/page.tsx` ("Gợi ý" / "Mẹo vặt"), không tạo route riêng — giữ một màn hình đơn giản cho MVP.
- **Nguồn tips**: `lib/data/scrap-tips.ts` — chọn cây theo tag `regrow_from_scraps`/`regrow_from_cuttings` từ `getAllCrops()` rồi ghép với hướng dẫn từng bước viết tay (dữ liệu tĩnh, dễ mở rộng sau này).
- **Trình bày**: mỗi tip là card nhỏ (icon, tên cây, các bước 1-2-3), không lồng vào luồng Top 3 — theo đúng plan 5.3 "không làm lu mờ USP".

## Risks / Trade-offs

- [Tab làm phân tán khỏi recommendation] → Tab riêng biệt, recommendation vẫn là nội dung chính mặc định.

## Open Questions

- (không)
