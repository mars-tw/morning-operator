import { NextResponse } from "next/server";
import { z } from "zod";

import { assessProjectReadiness, projectReadinessInputSchema } from "@/lib/project-readiness";
import { getProjectRecipe, projectRecipeIdSchema } from "@/lib/project-recipes";

const projectReadinessRequestSchema = z.object({
  recipeId: projectRecipeIdSchema,
  evidence: projectReadinessInputSchema
}).strict();

const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0",
  "X-Content-Type-Options": "nosniff"
};

export async function POST(request: Request) {
  try {
    const input = projectReadinessRequestSchema.parse(await request.json());
    const recipe = getProjectRecipe(input.recipeId);
    if (!recipe) throw new Error("Unknown project recipe");

    return NextResponse.json({
      mode: "preview",
      recipe: {
        id: recipe.id,
        version: recipe.version,
        industryPackId: recipe.industryPackId,
        goals: recipe.goals,
        estimatedCoverage: recipe.estimatedCoverage,
        setupSteps: recipe.setupSteps,
        verificationChecks: recipe.verificationChecks,
        requiredApprovals: recipe.requiredApprovals,
        prohibitedActions: recipe.prohibitedActions,
        knownLimitations: recipe.knownLimitations,
        revenueScenario: recipe.revenueScenario
      },
      assessment: assessProjectReadiness(input.evidence),
      disclaimer: "Readiness and revenue potential are evidence-based scenarios, not guarantees of income, savings, or commercial success."
    }, { headers: noStoreHeaders });
  } catch (error) {
    const details = error instanceof z.ZodError
      ? error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message }))
      : undefined;
    return NextResponse.json({
      error: "The readiness evidence is invalid. Review the selected answers and try again.",
      details
    }, { status: 400, headers: noStoreHeaders });
  }
}
