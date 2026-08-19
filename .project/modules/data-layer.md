# Module: Data Layer

Đường dẫn: `lib/data/` + file gốc `crops_data.json`.

## Hiện tại (file-based, đủ cho MVP)

- `lib/data/crops.ts` import thẳng `crops_data.json` từ root (không duplicate dữ liệu).
- `getAllCrops(): Crop[]` — toàn bộ 15 cây.
- `getCropById(id): Crop | undefined`.
- `validateDataset(dataset)` — check mỗi record đủ 4 nhóm (CropBase/HardConstraints/GrowingRules/BeginnerSuccessFactors); ném lỗi mô tả rõ record nào hỏng. Chạy ngay lúc module load → CI bắt lệch schema sớm.
- `getDataset()` — dataset gốc (schema_version, notes, crops).

## Dữ liệu gốc (`crops_data.json`)

- `schema_version: "2.0"`, 15 cây (rau lá 7, gia vị 3, củ 2, quả 3):
  cai_xanh, rau_muong, mong_toi, xa_lach, hanh_la, hung_que, cai_ngot, rau_den, ngo_ri, cu_cai, ca_chua_bi, dua_leo, ot, dau_bap, su_hao.
- Mỗi field quan trọng có `source` + `confidence` (high/medium/low) — **confidence medium/low cần expert review trước production** (plan 4.5).
- Vùng trong `regional_rules`: `north_vietnam`, `south_vietnam` (highland KHÔNG có → engine fallback nhiệt độ).

## Kế hoạch migrate PostgreSQL (plan 4.2)

- Lưu 1 row/cây với JSON columns cho `growing_rules` và `regional_rules` (tách logic, gộp lưu trữ).
- Engine không đổi chữ ký — chỉ thay phần thân `getAllCrops()` đọc từ DB.
- Chưa làm trong vòng này (roadmap: postgres-migration có thể tạo openspec change khi cần).

## Quy tắc

- **Không sửa dữ liệu tùy tiện**: đổi số liệu → cập nhật `reason`/`source`/provenance.
- Không bỏ nhóm nào trong 4 nhóm (validateDataset sẽ fail).
