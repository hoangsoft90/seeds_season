# Design: garden-progress

## Data Model Changes

### GardenPlant — thêm trạng thái `harvested`
```typescript
type GardenStatus = "growing" | "ghost" | "harvested";

interface GardenPlant {
  // ...existing fields
  status: GardenStatus;
  harvested_at?: string; // ISO datetime, chỉ có khi status = harvested
}
```

Không thêm field `milestones_seen` — milestone badge hiển thị based on计算 từ planted_at + timeline, không cần persist. Mỗi lần render đều tính lại (đơn giản, deterministic).

## Components

### `PlantProgress` (mới, client component)
Nhận: `plantedAt: string`, `cropId: string`
Tính: daysSincePlanted, currentStage, progress%, milestone display
Render: progress bar + stage label + milestone badge (nếu có)

### `GardenView` (sửa)
- Thêm section "Đã thu hoạch" (harvested plants)
- Mỗi growing plant card thêm `<PlantProgress>`
- Thêm nút "Thu hoạch" khi progress ≥ 80%

### API Changes
- `PATCH /api/garden/[id]` hỗ trợ `{ status: "harvested" }` (bên cạnh `{ cause }` cho ghost)
- Validation: chỉ chuyển từ "growing" → "harvested"

## File Changes
- `lib/garden/types.ts` — thêm "harvested" vào GardenStatus, thêm harvested_at
- `lib/garden/store.ts` — hỗ trợ harvest action
- `app/api/garden/[id]/route.ts` — validation cho harvest
- `components/PlantProgress.tsx` — mới
- `components/GardenView.tsx` — tích hợp PlantProgress + harvested section
- `tests/garden.test.ts` — test harvest invariant
- `tests/garden-api.test.ts` — test harvest API
