import { z } from "zod";

const evidenceLevelSchema = z.enum(["none", "claimed", "observed", "verified"]);

export const projectReadinessInputSchema = z
  .object({
    demoAccess: z.enum(["none", "repository_only", "local", "public"]),
    coreWorkflowEvidence: z.enum(["none", "mocked", "partial", "end_to_end"]),
    persistence: z.enum(["none", "browser_only", "durable"]),
    tenancyModel: z.enum(["single_user", "single_tenant", "multi_tenant"]),
    tenantIsolation: z.enum(["not_applicable", "unverified", "verified", "failed"]),
    authRbac: z.enum(["not_applicable", "absent", "partial", "verified"]),
    hasExternalWrites: z.boolean(),
    hasRetryableOperations: z.boolean(),
    idempotency: z.enum(["not_applicable", "absent", "partial", "verified"]),
    paymentMode: z.enum(["none", "mock", "live"]),
    paymentSignature: z.enum(["not_applicable", "mock_only", "unverified", "verified"]),
    retryDeadLetter: z.enum(["not_applicable", "absent", "retry_only", "retry_and_dead_letter"]),
    ciTests: z.enum(["none", "tests_only", "ci_partial", "ci_full"]),
    deployment: z.enum(["none", "local", "public_demo", "production"]),
    piiExposure: z.enum(["none", "potential", "anonymous_readable", "cross_tenant"]),
    mockOnly: z.boolean(),
    mockPresentedAsReal: z.boolean(),
    documentation: evidenceLevelSchema,
    openSourceLicense: z.boolean(),
    revenueEvidence: z.enum(["none", "interest", "pilot", "paid_once", "repeatable_paid"]),
    marketDemandEvidence: evidenceLevelSchema,
    problemSeverity: z.enum(["low", "medium", "high"]),
    buyerClarity: z.enum(["unclear", "broad", "specific"]),
    pricingEvidence: evidenceLevelSchema
  })
  .strict()
  .superRefine((input, context) => {
    if (input.tenancyModel === "multi_tenant" && input.tenantIsolation === "not_applicable") {
      context.addIssue({
        code: "custom",
        path: ["tenantIsolation"],
        message: "Multi-tenant projects must assess tenant isolation."
      });
    }
    if (input.tenancyModel !== "multi_tenant" && input.tenantIsolation === "failed") {
      context.addIssue({
        code: "custom",
        path: ["tenantIsolation"],
        message: "Failed tenant isolation only applies to multi-tenant projects."
      });
    }
    if (input.paymentMode === "none" && input.paymentSignature !== "not_applicable") {
      context.addIssue({
        code: "custom",
        path: ["paymentSignature"],
        message: "Projects without a payment flow must mark payment signatures not applicable."
      });
    }
    if (input.paymentMode === "mock" && input.paymentSignature !== "mock_only") {
      context.addIssue({
        code: "custom",
        path: ["paymentSignature"],
        message: "Mock payments must use the mock_only payment signature state."
      });
    }
    if (input.paymentMode === "live" && ["not_applicable", "mock_only"].includes(input.paymentSignature)) {
      context.addIssue({
        code: "custom",
        path: ["paymentSignature"],
        message: "Live payments must explicitly assess provider signature verification."
      });
    }
    if (!input.hasRetryableOperations && input.retryDeadLetter !== "not_applicable") {
      context.addIssue({
        code: "custom",
        path: ["retryDeadLetter"],
        message: "Projects without retryable operations must mark retry/dead-letter not applicable."
      });
    }
    if (input.hasRetryableOperations && input.retryDeadLetter === "not_applicable") {
      context.addIssue({
        code: "custom",
        path: ["retryDeadLetter"],
        message: "Retryable operations must assess retry and dead-letter handling."
      });
    }
    if (!input.hasExternalWrites && !input.hasRetryableOperations && input.paymentMode === "none" && input.idempotency !== "not_applicable") {
      context.addIssue({
        code: "custom",
        path: ["idempotency"],
        message: "Read-only projects without retryable work must mark idempotency not applicable."
      });
    }
    if ((input.hasExternalWrites || input.hasRetryableOperations || input.paymentMode === "live") && input.idempotency === "not_applicable") {
      context.addIssue({
        code: "custom",
        path: ["idempotency"],
        message: "Projects with writes, retries, or live payments must assess idempotency."
      });
    }
  });

export type ProjectReadinessInput = z.infer<typeof projectReadinessInputSchema>;

export type ReadinessPriority = "P0" | "P1" | "P2";
export const readinessVerdicts = [
  "not_ready",
  "assignment_ready",
  "conditional_pilot",
  "commercial_pilot_ready",
  "commercial_go"
] as const;
export type ReadinessVerdict = (typeof readinessVerdicts)[number];

export const READINESS_SCENARIO_DISCLAIMER =
  "Market potential and monetization readiness are scenario-based estimates, not revenue guarantees." as const;

export const readinessFindingSchema = z.object({
  code: z.string().min(1),
  priority: z.enum(["P0", "P1", "P2"]),
  title: z.string().min(1),
  recommendation: z.string().min(1),
  blocksCommercialGo: z.boolean()
});
export type ReadinessFinding = z.infer<typeof readinessFindingSchema>;

export const projectReadinessAssessmentSchema = z.object({
  assignmentExecutionPercent: z.number().int().min(0).max(100),
  commercialDeliveryPercent: z.number().int().min(0).max(100),
  marketPotentialScore: z.number().min(0).max(10),
  monetizationReadinessScore: z.number().min(0).max(10),
  verdict: z.enum(readinessVerdicts),
  hardBlockerCodes: z.array(z.string().min(1)),
  findings: z.object({
    P0: z.array(readinessFindingSchema),
    P1: z.array(readinessFindingSchema),
    P2: z.array(readinessFindingSchema)
  }),
  scenarioDisclaimer: z.literal(READINESS_SCENARIO_DISCLAIMER)
});
export type ProjectReadinessAssessment = z.infer<typeof projectReadinessAssessmentSchema>;

const assignmentWeights = {
  demoAccess: { none: 0, repository_only: 5, local: 10, public: 14 },
  coreWorkflowEvidence: { none: 0, mocked: 9, partial: 22, end_to_end: 32 },
  persistence: { none: 0, browser_only: 7, durable: 14 },
  ciTests: { none: 0, tests_only: 7, ci_partial: 12, ci_full: 16 },
  deployment: { none: 0, local: 5, public_demo: 9, production: 12 },
  documentation: { none: 0, claimed: 3, observed: 7, verified: 9 }
} as const;

const commercialWeights = {
  coreWorkflowEvidence: { none: 0, mocked: 3, partial: 9, end_to_end: 15 },
  persistence: { none: 0, browser_only: 4, durable: 10 },
  tenantIsolation: { not_applicable: 6, unverified: 2, verified: 10, failed: 0 },
  authRbac: { not_applicable: 5, absent: 0, partial: 4, verified: 10 },
  idempotency: { not_applicable: 5, absent: 0, partial: 4, verified: 10 },
  paymentSignature: { not_applicable: 3, mock_only: 3, unverified: 0, verified: 10 },
  retryDeadLetter: { not_applicable: 5, absent: 0, retry_only: 4, retry_and_dead_letter: 10 },
  ciTests: { none: 0, tests_only: 3, ci_partial: 5, ci_full: 7 },
  deployment: { none: 0, local: 1, public_demo: 3, production: 5 },
  piiExposure: { none: 8, potential: 3, anonymous_readable: 0, cross_tenant: 0 },
  revenueEvidence: { none: 0, interest: 1, pilot: 2, paid_once: 4, repeatable_paid: 5 }
} as const;

const marketWeights = {
  marketDemandEvidence: { none: 0, claimed: 0.5, observed: 1.5, verified: 2.5 },
  problemSeverity: { low: 0.5, medium: 1.5, high: 2.5 },
  buyerClarity: { unclear: 0, broad: 1, specific: 2 },
  pricingEvidence: { none: 0, claimed: 0.5, observed: 1, verified: 1.5 },
  revenueEvidence: { none: 0, interest: 0.5, pilot: 0.75, paid_once: 1, repeatable_paid: 1.5 }
} as const;

function finding(
  code: string,
  priority: ReadinessPriority,
  title: string,
  recommendation: string,
  blocksCommercialGo = false
): ReadinessFinding {
  return { code, priority, title, recommendation, blocksCommercialGo };
}

function roundScore(score: number): number {
  return Math.round(Math.max(0, Math.min(10, score)) * 10) / 10;
}

function clampPercent(score: number): number {
  return Math.round(Math.max(0, Math.min(100, score)));
}

export function assessProjectReadiness(rawInput: unknown): ProjectReadinessAssessment {
  const input = projectReadinessInputSchema.parse(rawInput);
  const allFindings: ReadinessFinding[] = [];

  if (input.tenancyModel === "multi_tenant" && input.tenantIsolation !== "verified") {
    allFindings.push(
      finding(
        "TENANT_ISOLATION_UNSAFE",
        "P0",
        "Tenant isolation is not verified",
        "Add tenant-scoped storage and integration tests proving that one tenant cannot read or modify another tenant's records.",
        true
      )
    );
  }
  if (input.piiExposure === "anonymous_readable") {
    allFindings.push(
      finding(
        "ANONYMOUS_PII_EXPOSURE",
        "P0",
        "Personal data is readable without trusted authentication",
        "Require server-verified identity and deny anonymous access to personal records.",
        true
      )
    );
  }
  if (input.piiExposure === "cross_tenant") {
    allFindings.push(
      finding(
        "CROSS_TENANT_PII_EXPOSURE",
        "P0",
        "Personal data can cross tenant boundaries",
        "Stop production use, isolate every query and write by tenant, and add negative authorization tests before handling real data.",
        true
      )
    );
  }
  if (input.paymentMode === "live" && input.paymentSignature !== "verified") {
    allFindings.push(
      finding(
        "PAYMENT_SIGNATURE_UNVERIFIED",
        "P0",
        "Live payment events are not signature verified",
        "Verify the provider signature before recording payment success and reject unsigned or invalid events.",
        true
      )
    );
  }
  if (input.mockPresentedAsReal) {
    allFindings.push(
      finding(
        "MOCK_PRESENTED_AS_REAL",
        "P0",
        "Mock output is presented as a real transaction or delivery",
        "Label every mock path and artifact as a demo and require verified external evidence before claiming payment or delivery.",
        true
      )
    );
  }
  if ((input.hasExternalWrites || input.hasRetryableOperations || input.paymentMode === "live") && input.idempotency === "absent") {
    allFindings.push(
      finding(
        "IDEMPOTENCY_MISSING",
        "P0",
        "Retryable side effects have no idempotency protection",
        "Persist a stable idempotency key and make repeated delivery produce exactly one business result.",
        true
      )
    );
  }

  if ((input.tenancyModel === "multi_tenant" || input.piiExposure !== "none") && input.authRbac !== "verified") {
    allFindings.push(
      finding(
        "AUTH_RBAC_INCOMPLETE",
        input.piiExposure === "potential" ? "P0" : "P1",
        "Authentication and role enforcement are incomplete",
        "Derive the actor from a trusted session and enforce least-privilege roles on every server-side operation.",
        input.piiExposure === "potential"
      )
    );
  }
  if (input.hasRetryableOperations && input.retryDeadLetter !== "retry_and_dead_letter") {
    allFindings.push(
      finding(
        "RETRY_RECOVERY_INCOMPLETE",
        "P1",
        "Retryable work lacks bounded retry and dead-letter recovery",
        "Add maximum attempts, backoff, an audit record, and an operator-visible dead-letter state."
      )
    );
  }
  if (input.idempotency === "partial") {
    allFindings.push(
      finding(
        "IDEMPOTENCY_UNVERIFIED",
        "P1",
        "Idempotency is only partially evidenced",
        "Add a concurrency test proving repeated provider events or jobs create exactly one result."
      )
    );
  }
  if (input.ciTests !== "ci_full") {
    allFindings.push(
      finding(
        "CI_EVIDENCE_INCOMPLETE",
        input.ciTests === "none" ? "P1" : "P2",
        "Automated verification is incomplete",
        "Run typecheck, focused tests, production build, and a smoke test on a clean CI runner."
      )
    );
  }
  if (input.deployment !== "production") {
    allFindings.push(
      finding(
        "PRODUCTION_DEPLOYMENT_UNVERIFIED",
        "P2",
        "Production deployment is not verified",
        "Document a repeatable deployment, rollback, health check, and backup/restore drill before production use."
      )
    );
  }
  if (input.mockOnly) {
    allFindings.push(
      finding(
        "MOCK_ONLY_WORKFLOW",
        "P1",
        "The workflow is limited to mock adapters",
        "Keep the mock vertical slice, then verify one optional real adapter behind explicit approvals."
      )
    );
  }
  if (!input.openSourceLicense) {
    allFindings.push(
      finding(
        "LICENSE_MISSING",
        "P1",
        "No reusable open-source license is declared",
        "Add a reviewed OSI-approved license before inviting reuse or contributions."
      )
    );
  }
  if (input.revenueEvidence === "none") {
    allFindings.push(
      finding(
        "REVENUE_UNVALIDATED",
        "P2",
        "No paying-customer evidence exists",
        "Run a small approval-gated pilot and record price, delivery cost, support load, and renewal intent as a scenario."
      )
    );
  }

  let assignmentExecutionPercent =
    assignmentWeights.demoAccess[input.demoAccess] +
    assignmentWeights.coreWorkflowEvidence[input.coreWorkflowEvidence] +
    assignmentWeights.persistence[input.persistence] +
    assignmentWeights.ciTests[input.ciTests] +
    assignmentWeights.deployment[input.deployment] +
    assignmentWeights.documentation[input.documentation] +
    (input.openSourceLicense ? 3 : 0);

  let commercialDeliveryPercent =
    commercialWeights.coreWorkflowEvidence[input.coreWorkflowEvidence] +
    commercialWeights.persistence[input.persistence] +
    commercialWeights.tenantIsolation[input.tenantIsolation] +
    commercialWeights.authRbac[input.authRbac] +
    commercialWeights.idempotency[input.idempotency] +
    commercialWeights.paymentSignature[input.paymentSignature] +
    commercialWeights.retryDeadLetter[input.retryDeadLetter] +
    commercialWeights.ciTests[input.ciTests] +
    commercialWeights.deployment[input.deployment] +
    commercialWeights.piiExposure[input.piiExposure] +
    commercialWeights.revenueEvidence[input.revenueEvidence];

  const hardBlockerCodes = allFindings.filter((item) => item.blocksCommercialGo).map((item) => item.code);
  if (hardBlockerCodes.length) commercialDeliveryPercent = Math.min(commercialDeliveryPercent, 59);
  assignmentExecutionPercent = clampPercent(assignmentExecutionPercent);
  commercialDeliveryPercent = clampPercent(commercialDeliveryPercent);

  const marketPotentialScore = roundScore(
    marketWeights.marketDemandEvidence[input.marketDemandEvidence] +
      marketWeights.problemSeverity[input.problemSeverity] +
      marketWeights.buyerClarity[input.buyerClarity] +
      marketWeights.pricingEvidence[input.pricingEvidence] +
      marketWeights.revenueEvidence[input.revenueEvidence]
  );

  let monetizationReadinessScore = roundScore(
    commercialDeliveryPercent * 0.055 + marketPotentialScore * 0.25 + commercialWeights.revenueEvidence[input.revenueEvidence] * 0.4
  );
  if (hardBlockerCodes.length) monetizationReadinessScore = Math.min(monetizationReadinessScore, 4.9);
  if (input.mockOnly) monetizationReadinessScore = Math.min(monetizationReadinessScore, 3);

  let verdict: ReadinessVerdict;
  if (hardBlockerCodes.length || assignmentExecutionPercent < 50) {
    verdict = "not_ready";
  } else if (input.mockOnly || commercialDeliveryPercent < 55) {
    verdict = "assignment_ready";
  } else if (commercialDeliveryPercent < 75 || input.revenueEvidence === "none") {
    verdict = "conditional_pilot";
  } else if (commercialDeliveryPercent < 90 || input.revenueEvidence !== "repeatable_paid") {
    verdict = "commercial_pilot_ready";
  } else {
    verdict = "commercial_go";
  }

  return projectReadinessAssessmentSchema.parse({
    assignmentExecutionPercent,
    commercialDeliveryPercent,
    marketPotentialScore,
    monetizationReadinessScore,
    verdict,
    hardBlockerCodes,
    findings: {
      P0: allFindings.filter((item) => item.priority === "P0"),
      P1: allFindings.filter((item) => item.priority === "P1"),
      P2: allFindings.filter((item) => item.priority === "P2")
    },
    scenarioDisclaimer: READINESS_SCENARIO_DISCLAIMER
  });
}
