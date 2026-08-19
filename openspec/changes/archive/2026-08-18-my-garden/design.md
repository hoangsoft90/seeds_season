## Context

Xem `proposal.md` — Why. Hiện tại "Thêm vào vườn" là placeholder toast trong `app/page.tsx` (`addToGarden`). App chưa có bất kỳ storage per-user nào (data layer crop là file-based tĩnh), chưa có auth. Change này **phụ thuộc** `add-to-garden-auth` (cần user identity để lưu vườn per-user).

## Goals / Non-Goals

- **Goals**: thêm/xoá theo dõi cây, danh sách garden, Ghost Plant (died_at + cause), gợi ý theo lịch sử thất bại cơ bản.
- **Non-Goals**: widget passive tracker, emotional milestone notification, Harvest Brag Card, giới hạn 3 cây free (Phase 2 monetization), lịch chăm sóc chi tiết.

## Decisions

- **Storage**: file-based JSON per-user (`lib/garden/store.ts`) cho MVP — nhất quán với data layer hiện tại, đủ cho single-instance dev. Migrate SQLite/Postgres sau khi có auth thật mà không đổi API shape. (Nếu auth dùng service có sẵn DB, cân nhắc dùng chung — xem change `add-to-garden-auth`.)
- **Cause enum**: `sun_heat` (☀️ nắng gắt/héo) · `pest` (🐛 sâu bệnh) · `waterlogged` (🌊 úng nước) · `unknown` (❓ không rõ) — lưu bằng key tiếng Anh, label tiếng Việt ở UI (nhất quán với `lib/labels.ts`).
- **DELETE ≠ xoá**: API `DELETE /api/garden/[id]` chuyển bản ghi sang ghost (cause `unknown`) — không bao giờ xoá vật lý trong MVP (đúng plan: "KHÔNG xóa — chuyển sang Ghost").
- **Gợi ý cá nhân hoá**: đọc ghost history (crop_id + month + cause) trong `explanation.ts`; chỉ thêm một câu nudge khi có failure gần đây cùng crop ở tháng tương tự — KHÔNG đổi điểm số engine (giữ Golden Tests 21/21 ổn định).
- **UI**: trang `/garden` riêng + nút "Thêm vào vườn" trên card gọi API thật khi đã login.

## Risks / Trade-offs

- [Phụ thuộc auth chưa có] → Change này có dependency; thứ tự code: auth trước, garden sau. Nếu auth trễ, phần gợi ý cá nhân hoá vẫn làm được ở tầng explanation.
- [File-based storage không scale multi-instance] → Chấp nhận cho MVP dev; API shape giữ nguyên khi migrate.
- [Gợi ý theo failure làm user thấy "bị nhắc lỗi"] → Wording tích cực, gợi ý hành động thay vì chê ("tháng này thử Mồng tơi nhé!").

## Open Questions

- (chờ change `add-to-garden-auth`: provider auth + storage dùng chung hay tách)
