## Why

Plan mục 5.3: "Regrow from kitchen scraps — đặt ở tab riêng 'Mẹo vặt', không làm lu mờ USP chính 'What to grow now'". Đây là hook viral chi phí gần như bằng 0 (trồng lại từ gốc hành mua ở chợ) giúp người mới có thành công đầu tiên nhanh và giữ chân họ trước Phase 1.5.

## What Changes

- Tab "Mẹo vặt" trên trang chủ, tách biệt hoàn toàn khỏi luồng recommendation (Level 1/2).
- Liệt kê cây có khả năng regrow dựa trên tags hiện có (`regrow_from_scraps` — hành lá, `regrow_from_cuttings` — rau muống) kèm hướng dẫn từng bước: bắt đầu từ đâu, cốc/nước, chuyển đất, nắng, thu hoạch.
- Không thay đổi engine hay API.

## Capabilities

### New Capabilities
- `kitchen-scraps-tips`: tab mẹo trồng lại từ phế liệu bếp

### Modified Capabilities
- (không)

## Impact

- `app/page.tsx` (thêm tab UI), `components/ScrapTip.tsx` (mới), `lib/data/scrap-tips.ts` (mới, nội dung tĩnh)
- Không đụng `lib/recommendation-engine/*`, không đụng API.
