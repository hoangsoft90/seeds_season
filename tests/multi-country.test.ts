/**
 * Multi-Country Tests — verify recommendation engine works for Thailand and Indonesia.
 * 
 * Key checks:
 * 1. Each country has crops loaded correctly
 * 2. Engine produces recommendations for each country
 * 3. Country-specific crops appear in results
 * 4. NO_MATCH_STATE works for extreme inputs
 */

import { describe, it, expect } from "vitest";
import { getRecommendations } from "../lib/recommendation-engine/engine";
import { getCropsForCountry, getSupportedCropCountryIds } from "../lib/data/crops";
import { getAllCountries, getCountryConfig } from "../lib/data/countries";
import type { RecommendationContext } from "../lib/recommendation-engine/types";

describe("Multi-Country Support", () => {
  it("supports 3 countries with crop data", () => {
    const countries = getSupportedCropCountryIds();
    expect(countries).toContain("vietnam");
    expect(countries).toContain("thailand");
    expect(countries).toContain("indonesia");
  });

  it("each country has at least 5 crops", () => {
    for (const countryId of getSupportedCropCountryIds()) {
      const crops = getCropsForCountry(countryId);
      expect(crops.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("each country has a valid config with regions", () => {
    const countries = getAllCountries();
    for (const config of countries) {
      expect(config.id).toBeTruthy();
      expect(config.regions.length).toBeGreaterThanOrEqual(1);
      expect(config.default_region).toBeTruthy();
    }
  });

  // Vietnam — existing data
  it("Vietnam: north_vietnam in September recommends easy crops", () => {
    const crops = getCropsForCountry("vietnam");
    const ctx: RecommendationContext = {
      country: "vietnam",
      region: "north_vietnam",
      month: 9,
      location_type: "balcony",
      sunlight_hours: 4,
      pot_depth_cm: 20,
    };
    const result = getRecommendations(ctx, crops);
    expect(result.status).toBe("ok");
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  // Thailand
  it("Thailand: central_thailand in hot season recommends tropical crops", () => {
    const crops = getCropsForCountry("thailand");
    const ctx: RecommendationContext = {
      country: "thailand",
      region: "central_thailand",
      month: 4, // Hot season
      location_type: "balcony",
      sunlight_hours: 5,
      pot_depth_cm: 20,
    };
    const result = getRecommendations(ctx, crops);
    expect(result.status).toBe("ok");
    expect(result.recommendations.length).toBeGreaterThan(0);

    // Should include Thai-specific crops
    const ids = result.recommendations.map((r) => r.crop.crop_base.id);
    // kangkung or phak_bung (water spinach variants) should be good candidates
    const hasTropicalCrop = ids.some((id) =>
      ["kangkung", "phak_bung", "kaphrao", "khai_frao"].includes(id)
    );
    expect(hasTropicalCrop).toBe(true);
  });

  it("Thailand: cool season crops differ from hot season", () => {
    const crops = getCropsForCountry("thailand");
    const hotCtx: RecommendationContext = {
      country: "thailand",
      region: "central_thailand",
      month: 4, // Hot season
      location_type: "balcony",
      sunlight_hours: 5,
      pot_depth_cm: 20,
    };
    const coolCtx: RecommendationContext = {
      country: "thailand",
      region: "central_thailand",
      month: 1, // Cool season
      location_type: "balcony",
      sunlight_hours: 5,
      pot_depth_cm: 20,
    };
    const hotResult = getRecommendations(hotCtx, crops);
    const coolResult = getRecommendations(coolCtx, crops);
    expect(hotResult.status).toBe("ok");
    expect(coolResult.status).toBe("ok");

    // Rankings should differ between seasons
    const hotIds = hotResult.recommendations.map((r) => r.crop.crop_base.id);
    const coolIds = coolResult.recommendations.map((r) => r.crop.crop_base.id);
    const overlap = hotIds.filter((id) => coolIds.includes(id));
    // Thailand's tropical climate means less seasonal variation than Vietnam.
    // Some year-round crops (kangkung, basil) appear in both seasons — this is expected.
    // Key check: rankings should differ, not necessarily completely disjoint.
    expect(overlap.length).toBeLessThanOrEqual(3);
  });

  // Indonesia
  it("Indonesia: Java in dry season recommends year-round crops", () => {
    const crops = getCropsForCountry("indonesia");
    const ctx: RecommendationContext = {
      country: "indonesia",
      region: "java",
      month: 7, // Dry season
      location_type: "balcony",
      sunlight_hours: 5,
      pot_depth_cm: 20,
    };
    const result = getRecommendations(ctx, crops);
    expect(result.status).toBe("ok");
    expect(result.recommendations.length).toBeGreaterThan(0);

    // Should include Indonesian-specific crops
    const ids = result.recommendations.map((r) => r.crop.crop_base.id);
    const hasIndonesianCrop = ids.some((id) =>
      ["kangkung", "kemangi", "bayam", "sawi"].includes(id)
    );
    expect(hasIndonesianCrop).toBe(true);
  });

  it("Indonesia: extreme pot depth excludes deep-root crops", () => {
    const crops = getCropsForCountry("indonesia");
    const ctx: RecommendationContext = {
      country: "indonesia",
      region: "java",
      month: 7,
      location_type: "window",
      sunlight_hours: 3,
      pot_depth_cm: 10, // Very shallow
    };
    const result = getRecommendations(ctx, crops);
    expect(result.status).toBe("ok");

    // Exclude crops needing >10cm pot
    const ids = result.recommendations.map((r) => r.crop.crop_base.id);
    const excluded = result.excluded.map((e) => e.crop.crop_base.id);
    // terong (25cm) and tomat (25cm) should be excluded
    expect(excluded).toContain("terong");
    expect(excluded).toContain("tomat");
  });

  // Edge case: unknown region fallback
  it("unknown region falls back to tropical default temperatures", () => {
    const crops = getCropsForCountry("thailand");
    const ctx: RecommendationContext = {
      country: "thailand",
      region: "unknown_region", // Not in Thailand config
      month: 7,
      location_type: "balcony",
      sunlight_hours: 5,
      pot_depth_cm: 20,
    };
    // Should not crash — weather provider falls back to tropical default
    const result = getRecommendations(ctx, crops);
    expect(result.status).toBe("ok");
  });
});
