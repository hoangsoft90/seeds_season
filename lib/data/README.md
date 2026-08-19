# lib/data

Data layer — **Bước 2** (chưa implement ở Bước 1).

- `crops.ts` — load `crops_data.json` (file-based, đủ cho MVP; migrate sang PostgreSQL với JSON columns sau — xem schema `plan1_final_v2.md` mục 4.2).
- `crops_data.json` — bản copy dữ liệu 15 cây (hoặc import trực tiếp từ root).

Nguồn gốc: `crops_data.json` ở project root. Dữ liệu confidence `medium`/`low` cần expert review trước production (ghi chú trong file).
