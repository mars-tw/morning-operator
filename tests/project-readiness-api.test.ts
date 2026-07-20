import { describe, expect, it } from "vitest";

import { POST } from "@/app/api/project-readiness/route";
import type { ProjectReadinessInput } from "@/lib/project-readiness";

const safeEvidence: ProjectReadinessInput = {
  demoAccess: "public",
  coreWorkflowEvidence: "end_to_end",
  persistence: "durable",
  tenancyModel: "single_tenant",
  tenantIsolation: "not_applicable",
  authRbac: "verified",
  hasExternalWrites: true,
  hasRetryableOperations: true,
  idempotency: "verified",
  paymentMode: "live",
  paymentSignature: "verified",
  retryDeadLetter: "retry_and_dead_letter",
  ciTests: "ci_full",
  deployment: "production",
  piiExposure: "none",
  mockOnly: false,
  mockPresentedAsReal: false,
  documentation: "verified",
  openSourceLicense: true,
  revenueEvidence: "repeatable_paid",
  marketDemandEvidence: "verified",
  problemSeverity: "high",
  buyerClarity: "specific",
  pricingEvidence: "verified"
};

describe("project readiness preview API", () => {
  it("returns a no-store preview without claiming guaranteed income", async () => {
    const response = await POST(new Request("http://localhost/api/project-readiness", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId: "commerce-groupbuy", evidence: safeEvidence })
    }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(body.mode).toBe("preview");
    expect(body.recipe).toMatchObject({ id: "commerce-groupbuy", industryPackId: "commerce_ops" });
    expect(body.assessment.verdict).toBe("commercial_go");
    expect(body.disclaimer).toMatch(/not guarantees/i);
  });

  it("rejects unknown fields and inconsistent payment evidence", async () => {
    const response = await POST(new Request("http://localhost/api/project-readiness", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipeId: "commerce-groupbuy",
        evidence: { ...safeEvidence, paymentMode: "live", paymentSignature: "mock_only" },
        customerEmail: "must-not-be-accepted@example.com"
      })
    }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(body.error).toMatch(/invalid/i);
  });
});
