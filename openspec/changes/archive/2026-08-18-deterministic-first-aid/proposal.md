## Why

Plan mục 6: **Deterministic First Aid** thay thế Ask Community ở giai đoạn chưa đủ user density (tránh cold-start). Khi cây có vấn đề (lá vàng, héo, sâu...), user được dẫn qua checklist phân nhánh dựa trên **luật cứng** — không phải AI đoán mò: *"Cây bị vàng lá? Bạn tưới bao nhiêu lần/ngày? > 2 lần → có thể úng rễ. Xử lý: ngưng tưới 3 ngày, xới đất."* Zero-cost, chính xác, và là nguồn dữ liệu cho Plant Doctor AI ở Phase 2.

## What Changes

- Luồng First Aid: user chọn triệu chứng (lá vàng / héo / đốm lá / sâu bọ / rễ úng...) → câu hỏi phân nhánh yes/no hoặc chọn nhanh → **diagnosis + cách xử lý từng bước**.
- Nguồn luật: dữ liệu tĩnh có cấu trúc (`lib/data/first-aid.ts`) — symptom → questions → diagnosis → remedy.
- Entry point: nút "Cây có vấn đề?" trên crop detail page + (sau này) từ My Garden.
- Không AI, không cộng đồng, không cần login.

## Capabilities

### New Capabilities
- `first-aid`: checklist phân nhánh luật cứng cho triệu chứng cây phổ biến

### Modified Capabilities
- `crop-detail`: thêm entry point First Aid

## Impact

- `lib/data/first-aid.ts` (mới): dữ liệu luật cứng (symptom/questions/diagnosis/remedy)
- `lib/first-aid.ts` (mới): logic duyệt cây hỏi theo câu trả lời
- `app/first-aid/page.tsx` hoặc modal (mới): UI wizard
- `app/crops/[id]/page.tsx`: thêm nút entry
- KHÔNG đụng engine/API.
