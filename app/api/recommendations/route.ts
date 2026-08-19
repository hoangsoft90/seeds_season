/**
 * POST /api/recommendations — endpoint duy nhất của MVP.
 *
 * Body: RecommendationContext (xem lib/recommendation-engine/types.ts).
 * Trả về: Top 3 (2 easy + 1 step-up) kèm explanation "Why" (template text),
 * hoặc NO_MATCH_STATE nếu điều kiện quá khắc nghiệt.
 *
 * Không yêu cầu auth ở bước này (plan mục 5.1: không ép đăng nhập để xem gợi ý).
 */

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getRecommendations } from "@/lib/recommendation-engine/engine";
import { getAllCrops } from "@/lib/data/crops";
import { OpenMeteoWeatherProvider } from "@/lib/recommendation-engine/weather";
import type { WeatherInfo } from "@/lib/recommendation-engine/types";
import { buildWhyText, type GhostHistoryEntry } from "@/lib/explanation";
import { buildWhyTextAI } from "@/lib/explanation/ai-provider";
import { getGhostHistory } from "@/lib/garden/store";
import type { RecommendationContext, Region, LocationType } from "@/lib/recommendation-engine/types";

const REGIONS = new Set<Region>(["north_vietnam", "south_vietnam", "highland_vietnam"]);
const LOCATION_TYPES = new Set<LocationType>(["window", "balcony", "garden"]);

interface ValidationResult {
  ctx?: RecommendationContext;
  error?: string;
}

function validate(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { error: "Body phải là JSON object." };
  }
  const b = body as Record<string, unknown>;

  const region = b.region as Region;
  if (!REGIONS.has(region)) {
    return { error: `'region' không hợp lệ: ${String(b.region)}. Chấp nhận: ${[...REGIONS].join(", ")}` };
  }

  const month = Number(b.month);
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return { error: `'month' phải là số nguyên 1-12, nhận: ${String(b.month)}` };
  }

  const location_type = b.location_type as LocationType;
  if (!LOCATION_TYPES.has(location_type)) {
    return { error: `'location_type' không hợp lệ: ${String(b.location_type)}` };
  }

  const sunlight_hours = Number(b.sunlight_hours);
  if (!Number.isFinite(sunlight_hours) || sunlight_hours < 0) {
    return { error: `'sunlight_hours' phải là số ≥ 0, nhận: ${String(b.sunlight_hours)}` };
  }

  const pot_depth_raw = b.pot_depth_cm;
  let pot_depth_cm: number | null = null;
  if (pot_depth_raw !== null && pot_depth_raw !== undefined) {
    pot_depth_cm = Number(pot_depth_raw);
    if (!Number.isFinite(pot_depth_cm) || pot_depth_cm <= 0) {
      return { error: `'pot_depth_cm' phải là số dương hoặc null, nhận: ${String(pot_depth_raw)}` };
    }
  }

  const ctx: RecommendationContext = {
    region,
    month,
    location_type,
    sunlight_hours,
    pot_depth_cm,
    user_goal: b.user_goal as RecommendationContext["user_goal"],
    user_experience: b.user_experience as RecommendationContext["user_experience"],
    community_fail_rate_override: b.community_fail_rate_override as RecommendationContext["community_fail_rate_override"],
    weather: b.weather as RecommendationContext["weather"],
    forecast_temp_max_c: b.forecast_temp_max_c as number | undefined,
    forecast_temp_min_c: b.forecast_temp_min_c as number | undefined,
    forecast_condition: b.forecast_condition as string | undefined,
  };

  return { ctx };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body không phải JSON hợp lệ." }, { status: 400 });
  }

  const { ctx, error } = validate(body);
  if (!ctx || error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  // Phase 2: fetch weather thật từ Open-Meteo (async) trước khi gọi engine (sync)
  // resolveWeather ưu tiên context.weather nên ta put vào đây
  if (!ctx.weather) {
    const weatherProvider = new OpenMeteoWeatherProvider();
    try {
      const weather: WeatherInfo = await weatherProvider.getWeather(ctx);
      ctx.weather = weather;
    } catch {
      // Fallback: dummy weather (resolveWeather sẽ dùng monthly averages)
    }
  }
  const result = getRecommendations(ctx, getAllCrops());

  if (result.status === "no_match") {
    return NextResponse.json({
      status: "no_match",
      message: result.message,
      // Không expose candidates/excluded ra API public (audit là dev-only)
    });
  }

  // Data moat (change my-garden): nếu user đã đăng nhập, lấy lịch sử thất bại
  // (ghost plants) để thêm nudge cá nhân hoá vào explanation — KHÔNG đổi điểm engine.
  const { userId } = await auth();
  let ghostHistory: GhostHistoryEntry[] | undefined;
  if (userId) {
    ghostHistory = getGhostHistory(userId).map((p) => {
      const diedMonth = p.died_at ? new Date(p.died_at).getMonth() + 1 : null;
      const plantedMonth = new Date(p.planted_at).getMonth() + 1;
      return {
        cropId: p.crop_id,
        month: diedMonth ?? plantedMonth,
        cause: p.cause ?? "unknown",
      };
    });
  }

  const recs = result.recommendations;
  const allNames = recs.map((r) => r.crop.crop_base.names.canonical_vi);

  // Phase 2: AI explanation — thử OpenAI trước, fallback template
  // AI chỉ giải thích, KHÔNG thay đổi điểm engine (plan 0.4)
  const explanations = await Promise.all(
    recs.map((rec) => {
      const templateText = buildWhyText(rec.crop, rec.components, ctx.region, rec.role, {
        month: ctx.month,
        ghostHistory,
        alternativeNames: allNames,
      });
      return buildWhyTextAI(
        {
          crop: rec.crop,
          components: rec.components,
          region: ctx.region,
          role: rec.role,
          month: ctx.month,
          weather: ctx.weather,
        },
        templateText,
      );
    }),
  );

  return NextResponse.json({
    status: "ok",
    region: ctx.region,
    month: ctx.month,
    recommendations: recs.map((rec, i) => ({
      crop_id: rec.crop.crop_base.id,
      name: rec.crop.crop_base.names.canonical_vi,
      scientific: rec.crop.crop_base.names.scientific,
      category: rec.crop.crop_base.category,
      role: rec.role,
      score: Math.round(rec.score * 10) / 10,
      days_to_harvest: rec.crop.crop_base.timeline_base.days_to_harvest,
      why: explanations[i]!,
    })),
  });
}
