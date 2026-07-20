import { describe, expect, it } from "vitest";

import {
  getProjectRecipe,
  isProjectRecipeId,
  listProjectRecipes,
  parseProjectRecipeSetup,
  projectRecipeIds,
  projectRecipes,
  validateProjectRecipeRegistry
} from "@/lib/project-recipes";

const safeBase = {
  deploymentVisibility: "private",
  tenancy: "single_tenant",
  anonymousPiiRead: false,
  exposesUnitCost: false,
  idempotentOrders: true,
  autonomousFinancialDecisions: false
} as const;

describe("project recipe registry", () => {
  it("contains exactly five valid, versioned recipes mapped to existing packs", () => {
    expect(projectRecipeIds).toHaveLength(5);
    expect(Object.keys(projectRecipes)).toEqual([...projectRecipeIds]);
    expect(validateProjectRecipeRegistry()).toEqual([]);

    for (const recipe of listProjectRecipes()) {
      expect(recipe.version).toBe(1);
      expect(recipe.goals.length).toBeGreaterThan(0);
      expect(recipe.inputs.length).toBeGreaterThan(0);
      expect(recipe.outputs.length).toBeGreaterThan(0);
      expect(recipe.freeFirstDeployments.length).toBeGreaterThan(0);
      expect(recipe.estimatedCoverage.low).toBeGreaterThan(0);
      expect(recipe.estimatedCoverage.high).toBeGreaterThanOrEqual(recipe.estimatedCoverage.low);
      expect(recipe.metrics.length).toBeGreaterThan(0);
      expect(recipe.requiredApprovals.length).toBeGreaterThan(0);
      expect(recipe.prohibitedActions.length).toBeGreaterThan(0);
      expect(recipe.privacyBoundary.forbiddenDataFlows.length).toBeGreaterThan(0);
      expect(recipe.paymentBoundary.rules.length).toBeGreaterThan(0);
      expect(recipe.setupSteps.length).toBeGreaterThan(0);
      expect(recipe.verificationChecks.length).toBeGreaterThan(0);
      expect(recipe.knownLimitations.length).toBeGreaterThan(0);
      expect(recipe.revenueScenario.type).toBe("scenario");
      expect(recipe.revenueScenario.disclaimer).toBe("Scenario only; revenue and profit are not guaranteed.");
    }
  });

  it("provides boundary-safe lookup and list helpers", () => {
    expect(isProjectRecipeId("commerce-groupbuy")).toBe(true);
    expect(isProjectRecipeId("invented-seventh-pack")).toBe(false);
    expect(getProjectRecipe("professional-it-monitoring")?.industryPackId).toBe("professional_services");
    expect(getProjectRecipe("invented-seventh-pack")).toBeUndefined();
    expect(listProjectRecipes().map((recipe) => recipe.id)).toEqual([...projectRecipeIds]);
  });

  it("hard-blocks the known group-buy privacy, cost and idempotency defects", () => {
    expect(() => parseProjectRecipeSetup({
      ...safeBase,
      recipeId: "commerce-groupbuy",
      anonymousPiiRead: true
    })).toThrow(/anonymous_customer_pii_read/);

    expect(() => parseProjectRecipeSetup({
      ...safeBase,
      recipeId: "commerce-groupbuy",
      exposesUnitCost: true
    })).toThrow(/anonymous_unit_cost_exposure/);

    expect(() => parseProjectRecipeSetup({
      ...safeBase,
      recipeId: "commerce-groupbuy",
      idempotentOrders: false
    })).toThrow(/idempotent/);
  });

  it("hard-blocks unsafe household tenancy, visibility and financial decisions", () => {
    expect(() => parseProjectRecipeSetup({
      ...safeBase,
      recipeId: "household-finance-private",
      deploymentVisibility: "public"
    })).toThrow(/private/);

    expect(() => parseProjectRecipeSetup({
      ...safeBase,
      recipeId: "household-finance-private",
      tenancy: "multi_tenant"
    })).toThrow(/single-tenant/);

    expect(() => parseProjectRecipeSetup({
      ...safeBase,
      recipeId: "household-finance-private",
      autonomousFinancialDecisions: true
    })).toThrow(/financial decisions/);
  });

  it("accepts safe setups for group-buy and private household finance", () => {
    expect(parseProjectRecipeSetup({ ...safeBase, recipeId: "commerce-groupbuy" }).recipeId).toBe("commerce-groupbuy");
    expect(parseProjectRecipeSetup({ ...safeBase, recipeId: "household-finance-private" }).recipeId).toBe("household-finance-private");
    expect(parseProjectRecipeSetup({ recipeId: "household-finance-private" })).toMatchObject(safeBase);
  });
});
