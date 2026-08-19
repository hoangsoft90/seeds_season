# Proposal: ai-explanation

## Status
**active** — ready for implementation

## Summary
Thay thế template text explanations bằng AI-generated explanations tự nhiên hơn. AI chỉ giải thích, KHÔNG thay đổi recommendation engine — đúng nguyên tắc plan mục 0.4.

## Motivation
Plan mục 7: "AI explanation layer (chỉ giải thích, không thay recommendation)." Template text hiện tại ("Mùa này phù hợp vì...") cứng nhắc. AI có thể diễn giải tự nhiên: "Tháng 8 ở Hà Nội trời nóng 33°C — cải xanh sẽ bị đắng lá. Rau muống chịu nóng tốt hơn và lớn nhanh, phù hợp hơn cho bạn."

## Scope
- **In scope:**
  - `ExplainProvider` interface + `OpenAIExplanationProvider` implementation
  - Nhận recommendation context + top 3 crops → trả explanation text tự nhiên
  - Fallback về template text khi AI fail hoặc chưa có API key
  - UI hiển thị explanation "Why" thay template
  - Graceful degradation: không AI key = vẫn chạy được với template

- **Out of scope:**
  - AI recommendation (engine vẫn deterministic)
  - AI chat / Q&A
  - Image analysis / Plant Doctor

## Requirements
1. **R1:** Provider mới gọi OpenAI API để generate explanation text từ context + crop data
2. **R2:** Fallback về template text khi API fail hoặc không có key
3. **R3:** Explanation bao gồm: tại sao chọn cây này, lưu ý cho người mới, so sánh nhẹ với cây khác
4. **R4:** Response cache 5 phút (同一 context = same explanation)
5. **R5:** 21+ golden tests vẫn pass (engine không đổi)

## Dependencies
- OpenAI API key (user cần tạo tài khoản + lấy key)
- Existing explanation template (lib/explanation.ts)
