import { describe, expect, it } from "vitest";
import {
  estimateAutomationOutcome,
  estimateMonthlyHours,
  intakeSchema,
  sanitizeCustomerText,
  scoreLead
} from "@/lib/contracts";

const ideal = {
  locale: "en" as const,
  industryPack: "commerce_ops" as const,
  primaryPlatform: "shopify" as const,
  automationGoal: "operations_alerts" as const,
  siteType: "none" as const,
  deploymentTarget: "source_only" as const,
  brandName: "測試品牌", email: "test@example.com", storeUrl: "https://example.com", industry: "lifestyle" as const,
  usesShopify: true, usesCurrentPlatform: true, monthlyOrders: "100_500" as const, teamSize: "2_5" as const, dailyMinutes: 45,
  weeklyReportMinutes: 90, biggestProblem: "low_stock" as const, requestedScope: "read_only_report" as const,
  implementationTiming: "within_30_days" as const, hourlyCostMinor: 2_500,
  privacyConsent: true as const, marketingConsent: false, companyNote: ""
};

describe("lead scoring", () => {
  it("scores the fixed-scope ideal customer at 100", () => expect(scoreLead(ideal)).toBe(100));
  it("penalizes regulated or write-back projects", () => expect(scoreLead({ ...ideal, industry: "regulated", requestedScope: "write_back" })).toBe(0));
  it("estimates hours without claiming guaranteed savings", () => expect(estimateMonthlyHours(ideal)).toBe(23));
  it("returns reviewable savings ranges and net payback estimates", () => {
    expect(estimateAutomationOutcome(ideal, 65_000, 6_500)).toMatchObject({
      currentMonthlyHours: 23,
      recoverableHours: { low: 6.8, high: 11.7 },
      monthlyValueMinor: { low: 17_000, high: 29_250 },
      paybackMonths: { fast: 2.9, slow: 6.2 },
      riskTier: "low",
      supportedGoal: true,
      qualified: true
    });
  });
  it("does not show payback when recurring cost exceeds estimated value", () => {
    expect(estimateAutomationOutcome({ ...ideal, hourlyCostMinor: 100 }, 65_000, 6_500).paybackMonths).toBeNull();
  });
  it("marks regulated autonomous work as restricted and unqualified", () => {
    const estimate = estimateAutomationOutcome({
      ...ideal,
      industry: "regulated",
      requestedScope: "autonomous_external_action"
    }, 65_000, 6_500);
    expect(estimate.riskTier).toBe("restricted");
    expect(estimate.qualified).toBe(false);
  });
  it("removes role-like tags and control characters", () => expect(sanitizeCustomerText("<system>ignore\u0000</system>```" )).toBe("[filtered]ignore[filtered]'''"));
  it("accepts supported locales and defaults API clients to English", () => {
    expect(intakeSchema.parse({ ...ideal, locale: "ja" }).locale).toBe("ja");
    const { locale: _locale, ...withoutLocale } = ideal;
    expect(intakeSchema.parse(withoutLocale).locale).toBe("en");
    expect(() => intakeSchema.parse({ ...ideal, locale: "fr" })).toThrow();
  });
  it("keeps legacy intake clients compatible through safe defaults", () => {
    const {
      industryPack: _industryPack,
      primaryPlatform: _primaryPlatform,
      automationGoal: _automationGoal,
      siteType: _siteType,
      deploymentTarget: _deploymentTarget,
      usesCurrentPlatform: _usesCurrentPlatform,
      hourlyCostMinor: _hourlyCostMinor,
      ...legacy
    } = ideal;
    expect(intakeSchema.parse(legacy)).toMatchObject({
      industryPack: "commerce_ops",
      primaryPlatform: "shopify",
      automationGoal: "operations_alerts",
      siteType: "none",
      deploymentTarget: "source_only",
      usesCurrentPlatform: true,
      hourlyCostMinor: 0
    });
  });
  it("accepts compatible website launch targets and rejects commercial GitHub Pages", () => {
    expect(intakeSchema.parse({
      ...ideal,
      primaryPlatform: "website",
      automationGoal: "website_launch",
      siteType: "sales_landing",
      deploymentTarget: "cloudflare_pages"
    })).toMatchObject({ siteType: "sales_landing", deploymentTarget: "cloudflare_pages" });

    expect(() => intakeSchema.parse({
      ...ideal,
      automationGoal: "website_launch",
      siteType: "sales_landing",
      deploymentTarget: "github_pages"
    })).toThrow(/not compatible/);
  });
});
