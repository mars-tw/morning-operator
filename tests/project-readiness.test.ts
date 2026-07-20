import { describe, expect, it } from "vitest";
import {
  assessProjectReadiness,
  projectReadinessAssessmentSchema,
  projectReadinessInputSchema,
  READINESS_SCENARIO_DISCLAIMER,
  type ProjectReadinessInput
} from "@/lib/project-readiness";

const common: ProjectReadinessInput = {
  demoAccess: "public",
  coreWorkflowEvidence: "partial",
  persistence: "durable",
  tenancyModel: "single_tenant",
  tenantIsolation: "not_applicable",
  authRbac: "not_applicable",
  hasExternalWrites: false,
  hasRetryableOperations: false,
  idempotency: "not_applicable",
  paymentMode: "none",
  paymentSignature: "not_applicable",
  retryDeadLetter: "not_applicable",
  ciTests: "ci_full",
  deployment: "public_demo",
  piiExposure: "none",
  mockOnly: false,
  mockPresentedAsReal: false,
  documentation: "verified",
  openSourceLicense: true,
  revenueEvidence: "none",
  marketDemandEvidence: "observed",
  problemSeverity: "medium",
  buyerClarity: "specific",
  pricingEvidence: "claimed"
};

// Anonymous fixtures model the five reviewed submissions without storing author names or personal data.
const studentFixtures = {
  manufacturingAnalytics: {
    ...common,
    coreWorkflowEvidence: "end_to_end",
    persistence: "browser_only",
    openSourceLicense: false,
    problemSeverity: "high"
  },
  householdFinance: {
    ...common,
    coreWorkflowEvidence: "partial",
    tenancyModel: "multi_tenant",
    tenantIsolation: "failed",
    authRbac: "partial",
    hasExternalWrites: true,
    hasRetryableOperations: true,
    idempotency: "partial",
    retryDeadLetter: "retry_only",
    piiExposure: "cross_tenant"
  },
  operationsScanner: {
    ...common,
    demoAccess: "local",
    persistence: "none",
    ciTests: "none",
    deployment: "public_demo",
    documentation: "observed",
    marketDemandEvidence: "verified",
    problemSeverity: "high"
  },
  communityWorkflow: {
    ...common,
    demoAccess: "local",
    coreWorkflowEvidence: "end_to_end",
    hasExternalWrites: true,
    hasRetryableOperations: true,
    idempotency: "verified",
    retryDeadLetter: "retry_and_dead_letter",
    ciTests: "tests_only",
    deployment: "local",
    mockOnly: true,
    marketDemandEvidence: "observed",
    buyerClarity: "specific"
  },
  groupOrderManager: {
    ...common,
    coreWorkflowEvidence: "mocked",
    persistence: "none",
    authRbac: "absent",
    hasExternalWrites: true,
    idempotency: "absent",
    ciTests: "none",
    piiExposure: "anonymous_readable",
    mockOnly: true,
    documentation: "observed"
  }
} as const satisfies Record<string, ProjectReadinessInput>;

describe("project commercial-readiness engine", () => {
  it("validates boundary input and rejects inconsistent evidence", () => {
    expect(projectReadinessInputSchema.safeParse(common).success).toBe(true);
    expect(
      projectReadinessInputSchema.safeParse({
        ...common,
        paymentMode: "live",
        paymentSignature: "not_applicable"
      }).success
    ).toBe(false);
    expect(
      projectReadinessInputSchema.safeParse({
        ...common,
        hasExternalWrites: true,
        idempotency: "not_applicable"
      }).success
    ).toBe(false);
  });

  it("keeps execution evidence separate from commercial readiness", () => {
    const result = assessProjectReadiness(studentFixtures.manufacturingAnalytics);

    expect(result.assignmentExecutionPercent).toBeGreaterThanOrEqual(75);
    expect(result.commercialDeliveryPercent).toBeLessThan(result.assignmentExecutionPercent);
    expect(result.findings.P1.map((item) => item.code)).toContain("LICENSE_MISSING");
    expect(result.findings.P2.map((item) => item.code)).toContain("REVENUE_UNVALIDATED");
  });

  it("keeps every fixture score inside the published API ranges", () => {
    for (const fixture of Object.values(studentFixtures)) {
      const result = assessProjectReadiness(fixture);

      expect(result.assignmentExecutionPercent).toBeGreaterThanOrEqual(0);
      expect(result.assignmentExecutionPercent).toBeLessThanOrEqual(100);
      expect(result.commercialDeliveryPercent).toBeGreaterThanOrEqual(0);
      expect(result.commercialDeliveryPercent).toBeLessThanOrEqual(100);
      expect(result.marketPotentialScore).toBeGreaterThanOrEqual(0);
      expect(result.marketPotentialScore).toBeLessThanOrEqual(10);
      expect(result.monetizationReadinessScore).toBeGreaterThanOrEqual(0);
      expect(result.monetizationReadinessScore).toBeLessThanOrEqual(10);
    }
  });

  it("makes the queue-and-recovery workflow the strongest commercial foundation", () => {
    const community = assessProjectReadiness(studentFixtures.communityWorkflow);
    const manufacturing = assessProjectReadiness(studentFixtures.manufacturingAnalytics);
    const scanner = assessProjectReadiness(studentFixtures.operationsScanner);

    expect(community.commercialDeliveryPercent).toBeGreaterThan(manufacturing.commercialDeliveryPercent);
    expect(community.commercialDeliveryPercent).toBeGreaterThan(scanner.commercialDeliveryPercent);
    expect(community.verdict).toBe("assignment_ready");
    expect(community.monetizationReadinessScore).toBeLessThanOrEqual(3);
  });

  it("treats verified demand as a scenario, never as guaranteed revenue", () => {
    const scanner = assessProjectReadiness(studentFixtures.operationsScanner);
    const household = assessProjectReadiness(studentFixtures.householdFinance);

    expect(scanner.marketPotentialScore).toBeGreaterThan(household.marketPotentialScore);
    expect(scanner.marketPotentialScore).toBeLessThanOrEqual(10);
    expect(scanner.scenarioDisclaimer).toBe(READINESS_SCENARIO_DISCLAIMER);
    expect(projectReadinessAssessmentSchema.safeParse(scanner).success).toBe(true);
  });

  it("cannot offset cross-tenant PII exposure with a public demo and full CI", () => {
    const result = assessProjectReadiness(studentFixtures.householdFinance);

    expect(result.hardBlockerCodes).toEqual(expect.arrayContaining(["TENANT_ISOLATION_UNSAFE", "CROSS_TENANT_PII_EXPOSURE"]));
    expect(result.commercialDeliveryPercent).toBeLessThanOrEqual(59);
    expect(result.verdict).toBe("not_ready");
  });

  it("cannot offset anonymous PII, missing idempotency, or mock-only delivery", () => {
    const result = assessProjectReadiness(studentFixtures.groupOrderManager);

    expect(result.hardBlockerCodes).toEqual(expect.arrayContaining(["ANONYMOUS_PII_EXPOSURE", "IDEMPOTENCY_MISSING"]));
    expect(result.verdict).toBe("not_ready");
    expect(result.commercialDeliveryPercent).toBeLessThanOrEqual(49);
    expect(result.monetizationReadinessScore).toBeLessThanOrEqual(3);
  });

  it("blocks commercial Go for unsigned live payments even with perfect UI-independent evidence", () => {
    const result = assessProjectReadiness({
      ...common,
      coreWorkflowEvidence: "end_to_end",
      hasExternalWrites: true,
      hasRetryableOperations: true,
      idempotency: "verified",
      paymentMode: "live",
      paymentSignature: "unverified",
      retryDeadLetter: "retry_and_dead_letter",
      deployment: "production",
      revenueEvidence: "repeatable_paid",
      marketDemandEvidence: "verified",
      pricingEvidence: "verified"
    });

    expect(result.hardBlockerCodes).toContain("PAYMENT_SIGNATURE_UNVERIFIED");
    expect(result.verdict).toBe("not_ready");
  });

  it("blocks commercial Go whenever a mock result is presented as real", () => {
    const result = assessProjectReadiness({
      ...common,
      coreWorkflowEvidence: "end_to_end",
      mockOnly: false,
      mockPresentedAsReal: true,
      deployment: "production",
      revenueEvidence: "repeatable_paid",
      marketDemandEvidence: "verified",
      pricingEvidence: "verified"
    });

    expect(result.hardBlockerCodes).toContain("MOCK_PRESENTED_AS_REAL");
    expect(result.verdict).toBe("not_ready");
  });

  it("allows commercial Go only with verified safety and repeatable paid evidence", () => {
    const result = assessProjectReadiness({
      ...common,
      coreWorkflowEvidence: "end_to_end",
      hasExternalWrites: true,
      hasRetryableOperations: true,
      idempotency: "verified",
      paymentMode: "live",
      paymentSignature: "verified",
      retryDeadLetter: "retry_and_dead_letter",
      deployment: "production",
      revenueEvidence: "repeatable_paid",
      marketDemandEvidence: "verified",
      pricingEvidence: "verified"
    });

    expect(result.hardBlockerCodes).toEqual([]);
    expect(result.commercialDeliveryPercent).toBeGreaterThanOrEqual(90);
    expect(result.verdict).toBe("commercial_go");
  });
});
