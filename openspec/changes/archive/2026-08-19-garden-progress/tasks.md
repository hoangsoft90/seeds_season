# Tasks: garden-progress

## Tasks

- [x] 1. Data model: thêm "harvested" status + harvested_at vào GardenPlant types
- [x] 2. Store: hỗ trợ harvest action (PATCH growing → harvested, lưu harvested_at)
- [x] 3. API: PATCH /api/garden/[id] validation cho harvest (chỉ growing → harvested)
- [x] 4. Component PlantProgress.tsx: progress bar + stage label + milestone badge
- [x] 5. GardenView: tích hợp PlantProgress + section "Đã thu hoạch" + nút "Thu hoạch"
- [x] 6. Unit tests: harvest invariant + progress calculation + milestone logic (10 store + 8 progress)
- [x] 7. Verify: tsc/lint干净, 68/68 test, build OK
