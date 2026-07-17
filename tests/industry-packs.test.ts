import { describe, expect, it } from "vitest";
import {
  assessAutomationRisk,
  industryPackIds,
  industryPacks,
  supportsAutomationGoal,
  validateIndustryPackRegistry
} from "@/lib/industry-packs";

describe("industry-pack registry", () => {
  it("contains exactly six complete and valid versioned packs", () => {
    expect(industryPackIds).toHaveLength(6);
    expect(Object.keys(industryPacks)).toEqual([...industryPackIds]);
    expect(validateIndustryPackRegistry()).toEqual([]);

    for (const id of industryPackIds) {
      const pack = industryPacks[id];
      expect(pack.id).toBe(id);
      expect(pack.version).toBe(1);
      expect(pack.coverage.low).toBeGreaterThan(0);
      expect(pack.coverage.high).toBeGreaterThanOrEqual(pack.coverage.low);
      expect(pack.coverage.high).toBeLessThan(1);
      expect(pack.goals.length).toBeGreaterThan(0);
      expect(pack.metrics.length).toBeGreaterThan(0);
      expect(pack.requiredApprovals.length).toBeGreaterThan(0);
      expect(pack.prohibitedActions.length).toBeGreaterThan(0);
      expect(pack.inputExamples.length).toBeGreaterThan(0);
    }
  });

  it("checks goal compatibility instead of treating every pack as universal", () => {
    expect(supportsAutomationGoal("appointments", "scheduling")).toBe(true);
    expect(supportsAutomationGoal("commerce_ops", "scheduling")).toBe(false);
  });

  it("elevates regulated and autonomous scopes to restricted", () => {
    expect(assessAutomationRisk({
      packId: "commerce_ops",
      industry: "regulated",
      requestedScope: "read_only_report"
    })).toBe("restricted");
    expect(assessAutomationRisk({
      packId: "backoffice",
      industry: "other",
      requestedScope: "autonomous_external_action"
    })).toBe("restricted");
    expect(assessAutomationRisk({
      packId: "professional_services",
      industry: "professional",
      requestedScope: "draft_and_review"
    })).toBe("medium");
  });
});
