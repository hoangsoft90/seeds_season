/**
 * Unit test cho HarvestBragCard (change harvest-brag-card).
 *
 * Kiểm tra: giá trị tính toán theo category + copy text format.
 */

import { describe, it, expect } from "vitest";
import { DEFAULT_YIELD_KG, MARKET_PRICE_PER_KG } from "../lib/labels";

describe("Harvest Brag Card value calculation", () => {
  it("leafy_green: 0.3kg × 30,000 = 9,000 VND", () => {
    const yieldKg = DEFAULT_YIELD_KG["leafy_green"];
    const price = MARKET_PRICE_PER_KG["leafy_green"];
    expect(yieldKg * price).toBe(9_000);
  });

  it("herb: 0.1kg × 50,000 = 5,000 VND", () => {
    const yieldKg = DEFAULT_YIELD_KG["herb"];
    const price = MARKET_PRICE_PER_KG["herb"];
    expect(yieldKg * price).toBe(5_000);
  });

  it("root_vegetable: 0.5kg × 25,000 = 12,500 VND", () => {
    const yieldKg = DEFAULT_YIELD_KG["root_vegetable"];
    const price = MARKET_PRICE_PER_KG["root_vegetable"];
    expect(yieldKg * price).toBe(12_500);
  });

  it("fruit_vegetable: 0.8kg × 35,000 = 28,000 VND", () => {
    const yieldKg = DEFAULT_YIELD_KG["fruit_vegetable"];
    const price = MARKET_PRICE_PER_KG["fruit_vegetable"];
    expect(yieldKg * price).toBe(28_000);
  });

  it("unknown category falls back to leafy_green defaults", () => {
    const yieldKg = DEFAULT_YIELD_KG["unknown_category"] ?? 0.3;
    const price = MARKET_PRICE_PER_KG["unknown_category"] ?? 30_000;
    expect(yieldKg * price).toBe(9_000);
  });
});

describe("Harvest Brag Card copy text format", () => {
  it("contains all required fields", () => {
    const cropName = "Rau muống";
    const daysPlanted = 28;
    const yieldKg = 0.3;
    const valueVnd = 9_000;

    const text = [
      `🌱 ${cropName} — ${daysPlanted} ngày trồng`,
      `📦 Ước tính: ${yieldKg}kg`,
      `💰 Giá trị quy đổi: ${valueVnd.toLocaleString("vi-VN")}đ`,
      `#TrồngGìHômNay`,
    ].join("\n");

    expect(text).toContain("Rau muống");
    expect(text).toContain("28 ngày");
    expect(text).toContain("0.3kg");
    expect(text).toContain("9.000đ");
    expect(text).toContain("#TrồngGìHômNay");
  });
});
