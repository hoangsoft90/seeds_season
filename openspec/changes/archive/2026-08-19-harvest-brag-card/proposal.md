# Proposal: harvest-brag-card

## Status
**active** — ready for implementation

## Summary
Tạo "Harvest Brag Card" — card hiển thị giá trị sản lượng quy đổi khi user thu hoạch cây. Ẩn mặc định, user bấm để hiện. Không gọi "tiết kiệm tiền" — dùng "giá trị sản lượng quy đổi theo giá rau sạch thị trường".

## Motivation
Plan mục 6: "Harvest Brag Card: dùng 'Giá trị sản lượng quy đổi' (không gọi 'tiết kiệm tiền' để tránh tranh cãi số liệu), kèm chú thích nhỏ 'theo giá rau sạch trung bình thị trường'. Có thể ẩn số tiền mặc định, chỉ hiện khi user chủ động bật."

## Scope
- **In scope:**
  - Harvest Brag Card hiển thị trên cây đã harvest (trong `/garden`)
  - Ẩn mặc định, user bấm "Xem giá trị" để hiện
  - Hiển thị: tên cây + số ngày trồng + ước tính sản lượng (kg) + giá trị quy đổi (VNĐ)
  - Chú thích: "theo giá rau sạch trung bình thị trường"
  - Nút "Chia sẻ" (copy text) — chưa cần image rendering

- **Out of scope:**
  - Image rendering / download
  - Social media sharing integration
  - Mã QR / deep link

## Requirements
1. **R1:** Mỗi harvested plant hiển thị nút "Xem giá trị" ẩn Brag Card
2. **R2:** Card tính giá trị dựa trên crop data (yield estimate × market price)
3. **R3:** Giá trị ẩn mặc định, bấm để hiện (animation nhẹ)
4. **R4:** Chú thích "theo giá rau sạch trung bình thị trường" luôn hiển thị
5. **R5:** Nút "Sao chép" copy text摘要 ra clipboard

## Dependencies
- `garden-progress` (harvested status)
- Crop data (yield estimate cần thêm hoặc dùng default)
