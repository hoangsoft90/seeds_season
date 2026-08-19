## Why

Plan mục 5.3 (MVP): crop detail page dạng tutorial thực dụng — khi nào trồng / ở đâu / đất / độ sâu / nước / khoảng cách / thu hoạch / vấn đề thường gặp / growth timeline. Hiện card recommendation chỉ hiển thị tên + "Why" ngắn; người mới chưa có chỗ học cách trồng từng cây, làm giảm khả năng First Successful Grow.

## What Changes

- Trang `/crops/[id]` render tutorial từ dữ liệu Schema v2 có sẵn (`growing_rules.optimal_conditions`, `planting_windows` theo vùng, `timeline_base.growth_stages`, `beginner_success_factors.notes`, `hard_constraints` reasons).
- Các card recommendation (Level 1/2) trỏ tới trang chi tiết cây.
- Id không tồn tại → 404.
- Nguồn dữ liệu confidence `low` → hiển thị ghi chú "gợi ý dựa trên ít dữ liệu địa phương" + lời mời báo cáo kết quả (thu thập data moat).

## Capabilities

### New Capabilities
- `crop-detail`: trang tutorial từng cây + điều hướng từ recommendation cards

### Modified Capabilities
- (không — engine và API không đổi hành vi)

## Impact

- `app/crops/[id]/page.tsx` (mới, server component + `generateStaticParams` cho 15 cây)
- `components/CropCard.tsx` (bọc tên cây thành Link)
- Không đổi `lib/recommendation-engine/*`, không đổi API.
