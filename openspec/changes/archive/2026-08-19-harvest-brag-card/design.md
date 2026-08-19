# Design: harvest-brag-card

## Data
Không thêm field vào GardenPlant — giá trị tính on-the-fly từ crop data + planted_at/harvested_at.

Thêm vào `lib/data/crops.ts` hoặc `lib/labels.ts`:
```typescript
const DEFAULT_YIELD_KG: Record<string, number> = {
  leafy_green: 0.3,
  herb: 0.1,
  root_vegetable: 0.5,
  fruit_vegetable: 0.8,
};

const MARKET_PRICE_PER_KG: Record<string, number> = {
  leafy_green: 30_000,
  herb: 50_000,
  root_vegetable: 25_000,
  fruit_vegetable: 35_000,
};
```

## Components

### `HarvestBragCard` (mới, client component)
Props: `cropId`, `plantedAt`, `harvestedAt`
Tính: daysPlanted, yield_kg, value_vnd
Render: toggle button + animated card + copy button

### `GardenView` (sửa)
- Harvested plants section thêm `<HarvestBragCard>` cho mỗi cây

## File Changes
- `lib/labels.ts` — thêm DEFAULT_YIELD_KG, MARKET_PRICE_PER_KG
- `components/HarvestBragCard.tsx` — mới
- `components/GardenView.tsx` — tích hợp HarvestBragCard
- `tests/harvest-brag.test.ts` — test giá trị tính toán + copy text
