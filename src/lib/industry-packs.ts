export const industryPackIds = [
  "commerce_ops",
  "professional_services",
  "appointments",
  "creator_education",
  "property_field",
  "backoffice"
] as const;

export type IndustryPackId = (typeof industryPackIds)[number];

export const automationGoals = [
  "reporting",
  "lead_followup",
  "scheduling",
  "content_ops",
  "document_ops",
  "operations_alerts"
] as const;

export type AutomationGoal = (typeof automationGoals)[number];
export type RiskTier = "low" | "medium" | "restricted";

export type IndustryPack = {
  id: IndustryPackId;
  version: 1;
  riskTier: Exclude<RiskTier, "restricted">;
  coverage: { low: number; high: number };
  goals: readonly AutomationGoal[];
  metrics: readonly string[];
  requiredApprovals: readonly string[];
  prohibitedActions: readonly string[];
  inputExamples: readonly string[];
};

export const industryPacks = {
  commerce_ops: {
    id: "commerce_ops",
    version: 1,
    riskTier: "low",
    coverage: { low: 0.35, high: 0.6 },
    goals: ["reporting", "lead_followup", "document_ops", "operations_alerts"],
    metrics: ["work_items_processed", "late_item_rate", "exception_rate", "manual_interventions"],
    requiredApprovals: ["data_access", "workflow_scope", "production_delivery"],
    prohibitedActions: ["automatic_refunds", "payment_changes", "unreviewed_order_changes", "customer_pii_to_ai"],
    inputExamples: ["orders", "inventory_summary", "support_categories", "fulfillment_status"]
  },
  professional_services: {
    id: "professional_services",
    version: 1,
    riskTier: "medium",
    coverage: { low: 0.25, high: 0.5 },
    goals: ["reporting", "lead_followup", "document_ops"],
    metrics: ["inquiries_triaged", "draft_turnaround", "approval_rate", "manual_interventions"],
    requiredApprovals: ["data_access", "outbound_message", "deliverable_release"],
    prohibitedActions: ["legal_or_financial_advice", "unreviewed_client_commitments", "eligibility_decisions", "confidential_data_to_ai"],
    inputExamples: ["inquiry_metadata", "approved_templates", "project_status", "time_entries"]
  },
  appointments: {
    id: "appointments",
    version: 1,
    riskTier: "medium",
    coverage: { low: 0.3, high: 0.55 },
    goals: ["reporting", "lead_followup", "scheduling", "operations_alerts"],
    metrics: ["requests_triaged", "response_time", "no_show_followups", "manual_interventions"],
    requiredApprovals: ["calendar_access", "message_template", "outbound_message"],
    prohibitedActions: ["medical_triage", "emergency_routing", "unreviewed_booking_commitments", "sensitive_notes_to_ai"],
    inputExamples: ["availability_windows", "request_metadata", "appointment_status", "approved_faq"]
  },
  creator_education: {
    id: "creator_education",
    version: 1,
    riskTier: "low",
    coverage: { low: 0.35, high: 0.65 },
    goals: ["reporting", "lead_followup", "content_ops", "document_ops"],
    metrics: ["assets_drafted", "review_cycle_time", "reuse_rate", "manual_interventions"],
    requiredApprovals: ["source_material", "brand_voice", "publication"],
    prohibitedActions: ["plagiarism", "unreviewed_publication", "fabricated_claims", "learner_pii_to_ai"],
    inputExamples: ["owned_transcripts", "approved_lessons", "content_calendar", "performance_aggregates"]
  },
  property_field: {
    id: "property_field",
    version: 1,
    riskTier: "medium",
    coverage: { low: 0.25, high: 0.5 },
    goals: ["reporting", "lead_followup", "scheduling", "document_ops", "operations_alerts"],
    metrics: ["requests_triaged", "jobs_scheduled", "document_turnaround", "manual_interventions"],
    requiredApprovals: ["record_access", "schedule_commitment", "outbound_message"],
    prohibitedActions: ["housing_eligibility", "tenant_scoring", "safety_certification", "unreviewed_contract_changes"],
    inputExamples: ["service_requests", "property_metadata", "availability", "inspection_checklists"]
  },
  backoffice: {
    id: "backoffice",
    version: 1,
    riskTier: "low",
    coverage: { low: 0.3, high: 0.6 },
    goals: ["reporting", "lead_followup", "document_ops", "operations_alerts"],
    metrics: ["records_processed", "exception_rate", "cycle_time", "manual_interventions"],
    requiredApprovals: ["data_access", "workflow_scope", "external_action"],
    prohibitedActions: ["payroll_changes", "employment_decisions", "bank_transfers", "unreviewed_record_deletion"],
    inputExamples: ["approved_spreadsheets", "shared_inbox_metadata", "crm_status", "document_index"]
  }
} as const satisfies Record<IndustryPackId, IndustryPack>;

export function getIndustryPack(id: IndustryPackId): IndustryPack {
  return industryPacks[id];
}

export function isIndustryPackId(value: unknown): value is IndustryPackId {
  return typeof value === "string" && industryPackIds.includes(value as IndustryPackId);
}

export function supportsAutomationGoal(packId: IndustryPackId, goal: AutomationGoal): boolean {
  return (industryPacks[packId].goals as readonly AutomationGoal[]).includes(goal);
}

export function assessAutomationRisk(input: {
  packId: IndustryPackId;
  industry: string;
  requestedScope: string;
}): RiskTier {
  if (input.industry === "regulated" || ["autonomous_external_action", "write_back"].includes(input.requestedScope)) {
    return "restricted";
  }
  if (input.requestedScope === "multi_platform") return "medium";
  return industryPacks[input.packId].riskTier;
}

export function validateIndustryPackRegistry(): string[] {
  const errors: string[] = [];
  for (const id of industryPackIds) {
    const pack = industryPacks[id];
    if (pack.id !== id) errors.push(`${id}: id mismatch`);
    if (!(pack.coverage.low > 0 && pack.coverage.low <= pack.coverage.high && pack.coverage.high < 1)) {
      errors.push(`${id}: invalid coverage range`);
    }
    if (!pack.goals.length) errors.push(`${id}: no automation goals`);
    if (!pack.metrics.length) errors.push(`${id}: no metrics`);
    if (!pack.requiredApprovals.length) errors.push(`${id}: no approvals`);
    if (!pack.prohibitedActions.length) errors.push(`${id}: no prohibited actions`);
  }
  return errors;
}
