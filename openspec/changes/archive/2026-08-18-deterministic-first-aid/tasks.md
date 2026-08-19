## 1. Dữ liệu luật cứng

- [x] 1.1 `lib/data/first-aid.ts`: types (FirstAidQuestion / FirstAidDiagnosis / FirstAidSymptom) + **6 triệu chứng**: lá vàng 🍂, héo rũ 🥀, đốm lá 🟤, sâu bọ 🐛, úng rễ 💧, chậm lớn 🐢
- [x] 1.2 Mỗi triệu chứng 2-3 câu hỏi phân nhánh → diagnosis + remedy từng bước (ngưng tưới/xới đất, che nắng, neem, thay chậu...) + luôn có `seekHelp` ("khi nào cần trợ giúp thêm")
- [x] 1.3 `lib/first-aid.ts`: hàm thuần `getNextNode(symptom, nodeId, answerId)` + `getNode`/`isDiagnosis`/`isQuestion`/`getSymptomById` — không loop (test DFS bảo vệ)

## 2. UI wizard

- [x] 2.1 Trang `/first-aid` + `components/FirstAidWizard.tsx`: lưới chọn triệu chứng (icon + label + desc)
- [x] 2.2 Câu hỏi → diagnosis (kèm remedy đánh số + seekHelp) + nút "🔁 Bắt đầu lại" / "Trả lời lại" / "← Quay lại" / "Hủy"
- [x] 2.3 Entry point: nút "🆘 Cây có vấn đề?" trên `app/crops/[id]/page.tsx` (callout đỏ, sau header)
- [x] 2.4 Mobile-first, chạy client-side hoàn toàn (không gọi API, không login) — dữ liệu luật cứng bundle client

## 3. Kiểm chứng

- [x] 3.1 Manual (unit test thay manual): lá vàng + tưới >2 lần/ngày → úng rễ (remedy "Ngưng tưới"); lá vàng + đất khô → thiếu nước — `tests/first-aid.test.ts`
- [x] 3.2 Anonymous dùng được hết flow — `/first-aid` 200 không cần login; wizard client-side
- [x] 3.3 `npx tsc --noEmit` + `npm run lint` + `npm test` (**58/58**: 21 golden + 8 store + 13 API + 5 explanation + 11 first-aid) + `npm run build` — tất cả sạch
