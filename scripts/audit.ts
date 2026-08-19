/**
 * Audit CLI (dev-only) — chạy Recommendation Audit Mode cho các context mẫu.
 * Dùng: `npx tsx scripts/audit.ts`
 *
 * KHÔNG phải user-facing — chỉ để developer verify engine khi review code
 * (plan mục 5.6).
 */

import { getRecommendations } from "../lib/recommendation-engine/engine";
import { getAllCrops } from "../lib/data/crops";
import { logAudit } from "../lib/recommendation-engine/audit";
import type { RecommendationContext } from "../lib/recommendation-engine/types";

const samples: { label: string; ctx: RecommendationContext }[] = [
  {
    label: "TC01 — Hà Nội tháng 8, ban công 3h nắng",
    ctx: { region: "north_vietnam", month: 8, location_type: "balcony", sunlight_hours: 3, pot_depth_cm: 20 },
  },
  {
    label: "TC02 — Hà Nội tháng 12 rét đậm, ban công 3h nắng",
    ctx: { region: "north_vietnam", month: 12, location_type: "balcony", sunlight_hours: 3, pot_depth_cm: 20 },
  },
  {
    label: "TC07 — Nắng nóng cực đoan 39°C",
    ctx: { region: "north_vietnam", month: 6, location_type: "balcony", sunlight_hours: 5, pot_depth_cm: 20, forecast_temp_max_c: 39 },
  },
  {
    label: "TC15 — Khắc nghiệt kép (rét + ít nắng + chậu 8cm) → NO_MATCH",
    ctx: { region: "north_vietnam", month: 1, location_type: "window", sunlight_hours: 1, pot_depth_cm: 8 },
  },
];

const crops = getAllCrops();

for (const { label, ctx } of samples) {
  console.log(`\n========== ${label} ==========`);
  logAudit(getRecommendations(ctx, crops), ctx);
}
