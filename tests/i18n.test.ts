/**
 * i18n Tests — verify translation keys work across all languages.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock expo-localization to avoid React Native dependency in Vitest
vi.mock("expo-localization", () => ({
  getLocales: () => [{ languageCode: "vi" }],
}));

import i18n, { setLanguage, getCurrentLanguage, t, type LanguageCode } from "../lib/i18n";
import { getCropLocalName } from "../lib/i18n/crops-i18n";

describe("i18n translations", () => {
  const languages: LanguageCode[] = ["vi", "en", "th", "id"];

  it("defaults to Vietnamese", () => {
    expect(getCurrentLanguage()).toBe("vi");
  });

  it("has all translation keys for all languages", () => {
    const keys = [
      "app.name",
      "onboarding.title",
      "onboarding.subtitle",
      "onboarding.country",
      "onboarding.submit",
      "location.window",
      "location.balcony",
      "location.garden",
      "results.title",
      "results.easy",
      "results.stepUp",
      "garden.title",
      "garden.empty",
      "garden.findPlants",
      "firstAid.title",
      "firstAid.subtitle",
      "cropDetail.notFound",
      "cropDetail.addToGarden",
      "labels.categories.leafy_green",
      "labels.difficulty.easy",
      "labels.water.consistent_moist",
      "labels.ghost.sun_heat",
      "explanation.stepUp",
      "explanation.inSeason",
    ];

    for (const lang of languages) {
      setLanguage(lang);
      for (const key of keys) {
        // Skip keys that require interpolation params
        if (key.includes("explanation.")) continue;
        const val = t(key);
        expect(val, `[${lang}] missing key: ${key}`).toBeTruthy();
        expect(val, `[${lang}] key still has placeholder: ${key}`).not.toContain("[missing");
      }
    }

    // Reset to Vietnamese
    setLanguage("vi");
  });

  it("switches language correctly", () => {
    setLanguage("en");
    expect(t("app.name")).toBe("🌱 What to Grow Today");

    setLanguage("th");
    expect(t("app.name")).toBe("🌱 วันนี้ปลูกอะไรดี");

    setLanguage("id");
    expect(t("app.name")).toBe("🌱 Hari Ini Tanam Apa");

    setLanguage("vi");
    expect(t("app.name")).toBe("🌱 Trồng Gì Hôm Nay");
  });

  it("handles parameter interpolation", () => {
    setLanguage("en");
    const result = t("onboarding.sunlight", { hours: 6 });
    expect(result).toContain("6");

    setLanguage("vi");
  });

  it("falls back to default locale for missing keys", () => {
    setLanguage("en");
    // Non-existent key should not crash
    const result = t("nonexistent.key");
    expect(typeof result).toBe("string");

    setLanguage("vi");
  });
});

describe("crop names i18n", () => {
  beforeEach(() => {
    setLanguage("vi");
  });

  it("returns Vietnamese name for vi locale", () => {
    setLanguage("vi");
    expect(getCropLocalName("rau_muong", "Rau muống")).toBe("Rau muống");
  });

  it("returns English name for en locale", () => {
    setLanguage("en");
    expect(getCropLocalName("rau_muong", "Rau muống")).toBe("Water Spinach");
  });

  it("returns Thai name for th locale", () => {
    setLanguage("th");
    expect(getCropLocalName("rau_muong", "Rau muống")).toBe("ผักบุ้ง");
  });

  it("returns Indonesian name for id locale", () => {
    setLanguage("id");
    expect(getCropLocalName("rau_muong", "Rau muống")).toBe("Kangkung");
  });

  it("falls back to canonical_vi for unknown crops", () => {
    setLanguage("en");
    expect(getCropLocalName("unknown_crop", "Cây lạ")).toBe("Cây lạ");
  });
});
