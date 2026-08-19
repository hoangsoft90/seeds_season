# Proposal: garden-progress

## Status
**active** — ready for implementation

## Summary
Thêm progress tracker và emotional milestone badges cho cây đang trồng trong My Garden. Dựa trên `planted_at` + `timeline_base` từ dữ liệu Schema v2 có sẵn.

## Motivation
Plan mục 6 Phase 1.5: "Passive Tracker qua Widget (ưu tiên hơn push notification hàng ngày)" + "Emotional milestone notification (nảy mầm / ra hoa / sắp thu hoạch)". Đây là feature giữ chân người dùng — thấy tiến trình = có động lực tiếp tục chăm.

## Scope
- **In scope:**
  - Progress bar trên mỗi cây đang trồng trong `/garden` (tính % từ `planted_at` đến `days_to_harvest[1]`)
  - Hiển thị giai đoạn hiện tại (germination → seedling → vegetative → harvest) dựa trên `growth_stages` từ crop data
  - Milestone badges khi cây đạt mốc: "🌱 Nảy mầm!" (germination end), "🌿 Lớn lên!" (seedling end), "🎉 Sắp thu hoạch!" (harvest stage start, còn 3-5 ngày)
  - Badge xuất hiện trong garden view, không cần push notification
  - Terminal milestone: "🎊 Đã thu hoạch!" khi quá ngày harvest max — user tự xác nhận

- **Out of scope:**
  - Push notification (cần PWA/service worker — deferred)
  - Widget home screen (cần PWA — deferred)
  - Bot nhắc nhở định kỳ

## Requirements
1. **R1:** Mỗi cây growing trong `/garden` hiển thị progress bar + ngày hiện tại / tổng ngày
2. **R2:** Hiển thị giai đoạn hiện tại (label tiếng Việt) và giai đoạn tiếp theo
3. **R3:** Milestone badge tự động hiển thị khi cây đạt mốc (không cần user action)
4. **R4:** User có thể đánh dấu "Đã thu hoạch" → chuyển sang trạng thái harvested (lưu harvested_at)
5. **R5:** Trạng thái harvested hiển thị trong lịch sử (không phải ghost, khác ghost)

## Out of Scope
- Push notifications
- Home screen widget
- Reminder notifications

## Dependencies
- `my-garden` (đã archive) — GardenPlant store + API
- Crop data có `timeline_base.growth_stages` + `days_to_harvest`
