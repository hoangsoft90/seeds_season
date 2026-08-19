## Context

Xem `proposal.md` — Why. Plan mục 6: First Aid trước Ask Community, luật cứng thay vì AI. App hiện có crop detail trang (`app/crops/[id]/page.tsx`) — nơi đặt entry point tự nhiên. Không cần auth/API.

## Goals / Non-Goals

- **Goals**: 5-7 triệu chứng phổ biến, mỗi triệu chứng 2-3 câu hỏi phân nhánh → diagnosis + remedy từng bước; chạy client-side hoàn toàn.
- **Non-Goals**: AI/Plant Doctor (Phase 2), Ask Community, ảnh user upload, theo dõi trạng thái cây, đa ngôn ngữ.

## Decisions

- **Dữ liệu luật cứng**: `lib/data/first-aid.ts` — cấu trúc:
  ```ts
  interface FirstAidNode {
    id: string;
    question: string;          // câu hỏi hiện tại
    answers: { label: string; next: string }[];  // nhánh theo câu trả lời
  }
  interface FirstAidSymptom {
    id: string;                // "yellow_leaves" | "wilting" | ...
    label: string;             // "Lá vàng"
    icon: string;              // emoji
    startNodeId: string;
    nodes: Record<string, FirstAidNode | DiagnosisNode>;
  }
  interface DiagnosisNode { id: string; diagnosis: string; remedy: string[]; }
  ```
  Nhánh kết thúc ở `DiagnosisNode` (diagnosis + remedy từng bước). Không loop.
- **Logic**: `lib/first-aid.ts` — hàm thuần `getNextNode(symptom, nodeId, answerId)`; UI wizard đơn giản giữ state `currentNodeId`.
- **UI**: modal hoặc trang `/first-aid` — chọn symptom (lưới icon) → câu hỏi → diagnosis/remedy; nút "Bắt đầu lại". Mobile-first.
- **Nguồn nội dung**: viết tay dựa trên kiến thức làm vườn phổ thông + dữ liệu crop (water/soil/temp từ schema khi liên quan) — nhất quán quy tắc "viết lại bằng ngôn ngữ riêng, không copy nguyên văn".

## Risks / Trade-offs

- [Luật sai → user làm theo hại cây] → Chỉ đưa mẹo an toàn phổ biến; luôn kèm "khi nào cần tìm trợ giúp thêm". Ghi chú đây là hướng dẫn chung.
- [Phạm vi luật hẹp, không cover mọi vấn đề] → Chấp nhận cho MVP; mỗi symptom là độc lập, dễ thêm sau.

## Open Questions

- (không)
