## Context

Xem `proposal.md` — Why. Trang chủ hiện là client component gọi `POST /api/recommendations`; dữ liệu cây nằm trong `crops_data.json` (file-based, xem `lib/data/crops.ts`). Không có DB.

## Goals / Non-Goals

- **Goals**: đọc trực tiếp từ dữ liệu có sẵn, không thêm DB/API call; trang tĩnh ở build time.
- **Non-Goals**: AI viết nội dung, video, bình luận cộng đồng, affiliate, spacing dữ liệu mới.

## Decisions

- **Route động + SSG**: `app/crops/[id]/page.tsx` là server component với `generateStaticParams` lấy từ `getAllCrops()` → 15 trang tĩnh, không cần fetch phía client.
- **Đọc thẳng data layer**: page gọi `getCropById(id)`; không có → `notFound()`.
- **Section renderer dùng chung**: map `GrowingRules`/`TimelineBase`/`HardConstraints` thành các section có tiêu đề rõ (Thời vụ theo vùng, Điều kiện lý tưởng, Chậu & đất, Timeline, Lưu ý người mới); `hard_constraints.*.reason` làm mục "Vì sao quan trọng".
- **Notice confidence thấp**: nếu `regional_rules[region].source.confidence === "low"` (hoặc bất kỳ source low) → hiện note khuyến khích báo cáo kết quả.
- **Link từ card**: `components/CropCard.tsx` bọc tên cây trong `next/link` → `/crops/[id]`.

## Risks / Trade-offs

- [Nội dung khô khan nếu chỉ dump dữ liệu] → Trình bày theo section hướng dẫn + gộp `notes` của từng nhóm làm mẹo thực dụng.
- [Dữ liệu confidence thấp lan toả] → Luôn kèm notice + lời mời báo cáo (biến rủi ro thành kênh thu data moat).

## Open Questions

- Khoảng cách trồng (spacing) chưa có trong schema hiện tại — bỏ qua cho tới khi có dữ liệu, không chặn change này.
