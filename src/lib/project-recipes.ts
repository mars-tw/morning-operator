import { z } from "zod";

import {
  automationGoals,
  getIndustryPack,
  industryPackIds,
  type AutomationGoal,
  type IndustryPackId
} from "./industry-packs";
import {
  deploymentProviderIds,
  type DeploymentProviderId
} from "./site-deployment";

export const projectRecipeIds = [
  "commerce-groupbuy",
  "professional-it-monitoring",
  "backoffice-manufacturing-watch",
  "appointments-community-events",
  "household-finance-private"
] as const;

export type ProjectRecipeId = (typeof projectRecipeIds)[number];

export const projectRecipeIdSchema = z.enum(projectRecipeIds);

const privacyModes = [
  "public_catalog_private_records",
  "private_customer_workspace",
  "private_single_tenant"
] as const;

const paymentModes = [
  "verified_provider_events",
  "manual_reconciliation",
  "no_payment_processing"
] as const;

export const projectRecipeSchema = z.object({
  id: projectRecipeIdSchema,
  version: z.number().int().positive(),
  industryPackId: z.enum(industryPackIds),
  goals: z.array(z.enum(automationGoals)).min(1),
  inputs: z.array(z.string().min(1)).min(1),
  outputs: z.array(z.string().min(1)).min(1),
  freeFirstDeployments: z.array(z.enum(deploymentProviderIds)).min(1),
  estimatedCoverage: z.object({
    low: z.number().gt(0).lt(1),
    high: z.number().gt(0).lt(1),
    basis: z.literal("scenario_not_guarantee")
  }),
  metrics: z.array(z.string().min(1)).min(1),
  requiredApprovals: z.array(z.string().min(1)).min(1),
  prohibitedActions: z.array(z.string().min(1)).min(1),
  privacyBoundary: z.object({
    mode: z.enum(privacyModes),
    allowedData: z.array(z.string().min(1)).min(1),
    forbiddenDataFlows: z.array(z.string().min(1)).min(1)
  }),
  paymentBoundary: z.object({
    mode: z.enum(paymentModes),
    rules: z.array(z.string().min(1)).min(1)
  }),
  setupSteps: z.array(z.string().min(1)).min(1),
  verificationChecks: z.array(z.string().min(1)).min(1),
  knownLimitations: z.array(z.string().min(1)).min(1),
  revenueScenario: z.object({
    type: z.literal("scenario"),
    description: z.string().min(1),
    disclaimer: z.literal("Scenario only; revenue and profit are not guaranteed.")
  })
}).strict();

export type ProjectRecipe = z.infer<typeof projectRecipeSchema>;

export const projectRecipes = {
  "commerce-groupbuy": {
    id: "commerce-groupbuy",
    version: 1,
    industryPackId: "commerce_ops",
    goals: ["reporting", "document_ops", "operations_alerts", "website_launch"],
    inputs: [
      "approved public product catalog without unit cost",
      "idempotent order requests with bounded quantities",
      "payment provider event metadata or an owner reconciliation decision",
      "fulfillment status without unnecessary customer fields"
    ],
    outputs: [
      "customer order receipt",
      "owner fulfillment queue",
      "reviewable message drafts",
      "aggregate sales and exception report"
    ],
    freeFirstDeployments: ["source_only", "cloudflare_pages", "cloudflare_workers"],
    estimatedCoverage: { low: 0.35, high: 0.55, basis: "scenario_not_guarantee" },
    metrics: ["orders_accepted_once", "duplicate_order_rate", "fulfillment_exceptions", "manual_interventions"],
    requiredApprovals: ["catalog_publish", "order_acceptance_scope", "payment_reconciliation", "outbound_message", "production_delivery"],
    prohibitedActions: [
      "anonymous_customer_pii_read",
      "anonymous_bulk_order_read",
      "anonymous_unit_cost_exposure",
      "non_idempotent_order_creation",
      "automatic_payment_confirmation_without_verified_event",
      "customer_pii_to_ai"
    ],
    privacyBoundary: {
      mode: "public_catalog_private_records",
      allowedData: ["public SKU, name and selling price", "authenticated owner aggregate reports", "minimum fulfillment metadata"],
      forbiddenDataFlows: ["anonymous phone or address lookup", "public unit cost or margin", "bulk customer records to AI"]
    },
    paymentBoundary: {
      mode: "verified_provider_events",
      rules: ["verify provider signature", "deduplicate by provider event ID", "require owner decision for ambiguous manual transfers"]
    },
    setupSteps: [
      "Import an approved catalog and omit supplier cost from every public payload.",
      "Configure quantity ceilings and an idempotency key for order creation.",
      "Connect a signed payment webhook or keep payment reconciliation manual.",
      "Run the anonymous-access and duplicate-submit verification checks before production approval."
    ],
    verificationChecks: [
      "anonymous requests cannot read customer PII or bulk orders",
      "public catalog responses never contain unit cost or margin",
      "ten submissions with one idempotency key create exactly one order",
      "unrecognized and excessive quantities are rejected",
      "unverified payment events never mark an order paid"
    ],
    knownLimitations: [
      "A static demo cannot persist real orders.",
      "Manual bank-transfer matching requires owner review.",
      "Carrier, tax and inventory adapters remain optional provider-specific work."
    ],
    revenueScenario: {
      type: "scenario",
      description: "A possible scenario is charging for setup, branded templates and ongoing maintenance after a measured pilot.",
      disclaimer: "Scenario only; revenue and profit are not guaranteed."
    }
  },
  "professional-it-monitoring": {
    id: "professional-it-monitoring",
    version: 1,
    industryPackId: "professional_services",
    goals: ["reporting", "document_ops", "website_launch"],
    inputs: [
      "owner-approved targets and scan scope",
      "availability and certificate metadata",
      "sanitized diagnostic results",
      "approved report templates"
    ],
    outputs: ["timestamped health report", "reviewable incident alert", "exception queue", "monthly trend summary"],
    freeFirstDeployments: ["source_only", "cloudflare_pages", "cloudflare_workers"],
    estimatedCoverage: { low: 0.25, high: 0.45, basis: "scenario_not_guarantee" },
    metrics: ["authorized_checks_run", "alert_delivery_rate", "false_positive_rate", "manual_interventions"],
    requiredApprovals: ["target_ownership", "scan_scope", "alert_destination", "outbound_message", "production_delivery"],
    prohibitedActions: [
      "unauthorized_target_scanning",
      "exploit_execution",
      "automatic_destructive_remediation",
      "secret_or_raw_log_data_to_ai",
      "unreviewed_client_commitments"
    ],
    privacyBoundary: {
      mode: "private_customer_workspace",
      allowedData: ["authorized endpoint metadata", "aggregate health measurements", "sanitized failure categories"],
      forbiddenDataFlows: ["credentials in reports", "raw customer logs to AI", "cross-customer monitoring results"]
    },
    paymentBoundary: {
      mode: "verified_provider_events",
      rules: ["separate payment from scan authorization", "verify and deduplicate payment events", "never expand scan scope after payment"]
    },
    setupSteps: [
      "Record target ownership, allowed checks and maintenance windows.",
      "Pin or verify every bundled runtime and produce a software bill of materials.",
      "Configure bounded schedules, retries, alerts and a dead-letter queue.",
      "Verify on a clean Windows runner before production approval."
    ],
    verificationChecks: [
      "an unapproved target is rejected before network access",
      "clean-runner tests verify CLI, fixtures and failure paths",
      "bundled runtime hashes and provenance are verifiable",
      "scheduler failure creates an actionable alert",
      "reports contain no credentials or raw confidential logs"
    ],
    knownLimitations: [
      "A static status page is a snapshot rather than continuous monitoring.",
      "Network monitoring requires explicit target authorization.",
      "Diagnosis is advisory and remediation remains owner-approved."
    ],
    revenueScenario: {
      type: "scenario",
      description: "A possible scenario is an authorized one-time health check followed by an optional monitoring retainer.",
      disclaimer: "Scenario only; revenue and profit are not guaranteed."
    }
  },
  "backoffice-manufacturing-watch": {
    id: "backoffice-manufacturing-watch",
    version: 1,
    industryPackId: "backoffice",
    goals: ["reporting", "document_ops", "operations_alerts"],
    inputs: ["approved work-order export", "inventory summary", "machine capacity assumptions", "reviewed risk thresholds"],
    outputs: ["overdue and shortage watchlist", "explainable risk score", "planner review queue", "aggregate performance report"],
    freeFirstDeployments: ["source_only", "cloudflare_pages"],
    estimatedCoverage: { low: 0.3, high: 0.5, basis: "scenario_not_guarantee" },
    metrics: ["work_orders_triaged", "late_item_rate", "risk_precision", "manual_interventions"],
    requiredApprovals: ["data_access", "field_mapping", "risk_thresholds", "workflow_scope", "production_delivery"],
    prohibitedActions: [
      "automatic_production_rescheduling",
      "automatic_supplier_commitments",
      "safety_or_quality_certification",
      "unreviewed_inventory_write_back",
      "worker_pii_to_ai"
    ],
    privacyBoundary: {
      mode: "private_customer_workspace",
      allowedData: ["work-order identifiers", "aggregate capacity and inventory", "sanitized exception reasons"],
      forbiddenDataFlows: ["worker PII to AI", "cross-factory records", "supplier confidential terms in public reports"]
    },
    paymentBoundary: {
      mode: "no_payment_processing",
      rules: ["keep factory workflow separate from merchant payment state", "require an approved commercial agreement outside the recipe"]
    },
    setupSteps: [
      "Map and validate the customer's export format using anonymous fixtures.",
      "Set factory-specific capacity, inventory and delay thresholds.",
      "Import read-only data and produce an explainable review queue.",
      "Run mobile, large-file and duplicate-record checks before production approval."
    ],
    verificationChecks: [
      "malformed, oversized and duplicate imports are safely rejected",
      "risk output cites the input factors and configured thresholds",
      "390-pixel layouts have no page-level horizontal overflow",
      "no production schedule or inventory record is changed automatically",
      "a pilot measures false positives and planner time rather than promised savings"
    ],
    knownLimitations: [
      "CSV analysis is not an ERP or MES integration.",
      "Risk scores require local calibration and do not predict every delay.",
      "Production and safety decisions remain with qualified staff."
    ],
    revenueScenario: {
      type: "scenario",
      description: "A possible scenario is a paid read-only pilot followed by integration and support if measured results justify it.",
      disclaimer: "Scenario only; revenue and profit are not guaranteed."
    }
  },
  "appointments-community-events": {
    id: "appointments-community-events",
    version: 1,
    industryPackId: "appointments",
    goals: ["reporting", "lead_followup", "scheduling", "operations_alerts", "website_launch"],
    inputs: ["approved event definition", "availability and capacity", "minimum participant contact fields", "approved message templates"],
    outputs: ["registration status", "owner approval queue", "idempotent notification jobs", "attendance exception report"],
    freeFirstDeployments: ["source_only", "cloudflare_pages", "cloudflare_workers"],
    estimatedCoverage: { low: 0.3, high: 0.5, basis: "scenario_not_guarantee" },
    metrics: ["registrations_processed", "notifications_delivered_once", "approval_wait_time", "manual_interventions"],
    requiredApprovals: ["event_publish", "participant_data_access", "message_template", "outbound_message", "production_delivery"],
    prohibitedActions: [
      "anonymous_participant_list_read",
      "unreviewed_booking_commitments",
      "unverified_payment_confirmation",
      "sensitive_notes_to_ai",
      "unauthenticated_approval_actor"
    ],
    privacyBoundary: {
      mode: "private_customer_workspace",
      allowedData: ["public event details", "authenticated owner registration view", "minimum notification destination"],
      forbiddenDataFlows: ["anonymous participant lists", "self-asserted approver identity", "sensitive participant notes to AI"]
    },
    paymentBoundary: {
      mode: "manual_reconciliation",
      rules: ["keep uncertain transfers pending", "record the authenticated owner decision", "use verified events when a provider adapter is enabled"]
    },
    setupSteps: [
      "Configure one event, capacity and approved messages using fake participant data.",
      "Enable authenticated roles for owner review and delivery approval.",
      "Configure idempotent notification jobs with retry and dead-letter handling.",
      "Verify backup and restore before production approval."
    ],
    verificationChecks: [
      "anonymous users cannot approve, export or view participant records",
      "the approval actor always comes from the authenticated session",
      "ten retries of one notification produce one external delivery",
      "ambiguous payment remains pending for owner review",
      "a restored backup preserves queue and audit history"
    ],
    knownLimitations: [
      "Message and AI mock adapters do not represent external delivery.",
      "A real provider requires credentials, consent and a reviewed adapter.",
      "The recipe does not make religious, medical or eligibility decisions."
    ],
    revenueScenario: {
      type: "scenario",
      description: "A possible scenario is an event setup fee plus optional maintenance after a trusted community pilot.",
      disclaimer: "Scenario only; revenue and profit are not guaranteed."
    }
  },
  "household-finance-private": {
    id: "household-finance-private",
    version: 1,
    industryPackId: "backoffice",
    goals: ["reporting", "document_ops", "operations_alerts"],
    inputs: ["single household receipts", "owner-authorized read-only mailbox metadata", "owner-defined categories", "local reminder rules"],
    outputs: ["private transaction draft", "owner review queue", "aggregate household report", "local exception reminder"],
    freeFirstDeployments: ["source_only", "cloudflare_workers"],
    estimatedCoverage: { low: 0.3, high: 0.4, basis: "scenario_not_guarantee" },
    metrics: ["documents_parsed", "classification_approval_rate", "duplicate_rate", "manual_interventions"],
    requiredApprovals: ["single_household_owner", "mailbox_read_access", "category_rules", "financial_record_commit", "production_delivery"],
    prohibitedActions: [
      "multi_tenant_household_storage",
      "public_household_deployment",
      "automatic_financial_decisions",
      "automatic_bank_transfers",
      "financial_advice",
      "household_pii_to_ai"
    ],
    privacyBoundary: {
      mode: "private_single_tenant",
      allowedData: ["one household's locally isolated records", "minimum read-only invoice metadata", "owner-approved aggregates"],
      forbiddenDataFlows: ["cross-household records", "public dashboard access", "raw household PII or attachments to AI"]
    },
    paymentBoundary: {
      mode: "no_payment_processing",
      rules: ["never initiate bank transfers", "never infer that a bill was paid", "require owner review for every financial record commit"]
    },
    setupSteps: [
      "Create a private single-tenant deployment for one household.",
      "Use trusted authentication and reject identity from untrusted request headers.",
      "Connect read-only sources with the minimum OAuth scopes and encrypted tokens.",
      "Verify transaction rollback, duplicate handling and private access before production approval."
    ],
    verificationChecks: [
      "public and cross-tenant access is rejected",
      "forged identity headers receive an unauthorized response",
      "a partial write rolls back and retries to exactly one complete record",
      "API failures return structured errors without leaking financial data",
      "no category, reminder or model output initiates a financial decision"
    ],
    knownLimitations: [
      "This is a private record-assistance recipe, not financial advice.",
      "Single-tenant storage intentionally does not support multiple households.",
      "OAuth verification and personal-data obligations can outweigh low subscription revenue."
    ],
    revenueScenario: {
      type: "scenario",
      description: "A possible scenario is a private self-hosting setup or white-label service after privacy review.",
      disclaimer: "Scenario only; revenue and profit are not guaranteed."
    }
  }
} as const satisfies Record<ProjectRecipeId, ProjectRecipe>;

export const projectRecipeSetupSchema = z.object({
  recipeId: projectRecipeIdSchema,
  deploymentVisibility: z.enum(["public", "private"]).default("private"),
  tenancy: z.enum(["single_tenant", "multi_tenant"]).default("single_tenant"),
  anonymousPiiRead: z.boolean().default(false),
  exposesUnitCost: z.boolean().default(false),
  idempotentOrders: z.boolean().default(true),
  autonomousFinancialDecisions: z.boolean().default(false)
}).strict().superRefine((input, context) => {
  if (input.recipeId === "commerce-groupbuy") {
    if (input.anonymousPiiRead) {
      context.addIssue({ code: "custom", path: ["anonymousPiiRead"], message: "anonymous_customer_pii_read is prohibited" });
    }
    if (input.exposesUnitCost) {
      context.addIssue({ code: "custom", path: ["exposesUnitCost"], message: "anonymous_unit_cost_exposure is prohibited" });
    }
    if (!input.idempotentOrders) {
      context.addIssue({ code: "custom", path: ["idempotentOrders"], message: "order creation must be idempotent" });
    }
  }

  if (input.recipeId === "household-finance-private") {
    if (input.deploymentVisibility !== "private") {
      context.addIssue({ code: "custom", path: ["deploymentVisibility"], message: "household finance must remain private" });
    }
    if (input.tenancy !== "single_tenant") {
      context.addIssue({ code: "custom", path: ["tenancy"], message: "household finance must remain single-tenant" });
    }
    if (input.autonomousFinancialDecisions) {
      context.addIssue({ code: "custom", path: ["autonomousFinancialDecisions"], message: "automatic financial decisions are prohibited" });
    }
  }
});

export type ProjectRecipeSetup = z.infer<typeof projectRecipeSetupSchema>;

export function isProjectRecipeId(value: unknown): value is ProjectRecipeId {
  return projectRecipeIdSchema.safeParse(value).success;
}

export function getProjectRecipe(value: unknown): ProjectRecipe | undefined {
  const result = projectRecipeIdSchema.safeParse(value);
  return result.success ? projectRecipes[result.data] : undefined;
}

export function listProjectRecipes(): readonly ProjectRecipe[] {
  return projectRecipeIds.map((id) => projectRecipes[id]);
}

export function parseProjectRecipeSetup(value: unknown): ProjectRecipeSetup {
  return projectRecipeSetupSchema.parse(value);
}

export function validateProjectRecipeRegistry(): string[] {
  const errors: string[] = [];

  for (const id of projectRecipeIds) {
    const recipe = projectRecipes[id];
    const parsed = projectRecipeSchema.safeParse(recipe);
    if (!parsed.success) {
      errors.push(...parsed.error.issues.map((issue) => `${id}: ${issue.path.join(".")}: ${issue.message}`));
      continue;
    }

    if (recipe.id !== id) errors.push(`${id}: id mismatch`);
    const pack = getIndustryPack(recipe.industryPackId);
    for (const goal of recipe.goals) {
      if (!(pack.goals as readonly AutomationGoal[]).includes(goal)) errors.push(`${id}: unsupported goal ${goal}`);
    }
    if (recipe.estimatedCoverage.low > recipe.estimatedCoverage.high) errors.push(`${id}: invalid coverage range`);
    if (recipe.estimatedCoverage.low < pack.coverage.low || recipe.estimatedCoverage.high > pack.coverage.high) {
      errors.push(`${id}: coverage exceeds ${recipe.industryPackId} bounds`);
    }
  }

  return errors;
}

export type { AutomationGoal, DeploymentProviderId, IndustryPackId };
