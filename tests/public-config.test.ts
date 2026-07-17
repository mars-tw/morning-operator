import { describe, expect, it } from "vitest";
import { currencyFractionDigits, formatMinorMoney } from "@/lib/public-config";

describe("global money formatting", () => {
  it("formats two-decimal and zero-decimal currencies from minor units", () => {
    expect(formatMinorMoney(65_000, "USD", "en")).toContain("650.00");
    expect(formatMinorMoney(1_980_000, "TWD", "zh-TW")).toContain("19,800");
    expect(currencyFractionDigits("JPY")).toBe(0);
  });

  it("falls back safely for invalid currency identifiers", () => {
    expect(formatMinorMoney(1234, "INVALID", "en")).toBe("INVALID 12.34");
  });
});
