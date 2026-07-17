import { z } from "zod";
import { supportedLocales } from "@/i18n";
import {
  assessAutomationRisk,
  automationGoals,
  getIndustryPack,
  industryPackIds,
  supportsAutomationGoal,
  type RiskTier
} from "@/lib/industry-packs";

export const intakeSchema = z.object({
  locale: z.enum(supportedLocales).default("en"),
  industryPack: z.enum(industryPackIds).default("commerce_ops"),
  primaryPlatform: z.enum(["shopify", "email", "spreadsheet", "calendar", "crm", "marketplace", "website", "other"]).default("shopify"),
  automationGoal: z.enum(automationGoals).default("operations_alerts"),
  brandName: z.string().trim().min(2).max(80),
  email: z.email().max(160),
  storeUrl: z.union([z.literal(""), z.url().max(300)]).default(""),
  industry: z.enum(["food", "lifestyle", "fashion", "professional", "appointments", "creator", "property", "nonprofit", "other", "regulated"]),
  usesShopify: z.boolean().default(false),
  usesCurrentPlatform: z.boolean().default(true),
  monthlyOrders: z.enum(["under_100", "100_500", "501_1500", "over_1500"]),
  teamSize: z.enum(["1", "2_5", "6_plus"]),
  dailyMinutes: z.number().int().min(0).max(600),
  weeklyReportMinutes: z.number().int().min(0).max(1200),
  biggestProblem: z.enum(["overdue", "refunds", "low_stock", "scattered_numbers", "data_entry", "lead_followup", "scheduling", "document_backlog", "content_reuse"]),
  requestedScope: z.enum(["read_only_report", "draft_and_review", "write_back", "multi_platform", "autonomous_external_action"]),
  implementationTiming: z.enum(["within_30_days", "one_to_three_months", "researching"]),
  hourlyCostMinor: z.number().int().min(0).max(10_000_000).default(0),
  privacyConsent: z.literal(true),
  marketingConsent: z.boolean().default(false),
  companyNote: z.string().trim().max(1000).default("")
});

export type IntakeInput = z.output<typeof intakeSchema>;
export type IntakeDraft = z.input<typeof intakeSchema>;

export const paymentSuccessSchema = z.object({
  provider: z.enum(["mock", "lemon_squeezy", "ecpay"]),
  providerEventId: z.string().min(4).max(200),
  providerOrderId: z.string().min(4).max(200).optional(),
  leadId: z.uuid(),
  amountMinor: z.number().int().positive().max(1_000_000_000),
  currency: z.string().trim().length(3).transform((value) => value.toUpperCase()),
  payloadHash: z.string().min(16).max(128),
  signatureValid: z.boolean()
});

export type PaymentSuccessInput = z.infer<typeof paymentSuccessSchema>;

export const approvalDecisionSchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  note: z.string().trim().max(1000).default("")
});

export type ApprovalDecision = z.infer<typeof approvalDecisionSchema>;

export const jobPayloadSchema = z.record(z.string(), z.unknown());

export type JobType = "draft_spec" | "codex_build" | "qa" | "send_digest" | "send_notifications";
export type ProjectState =
  | "paid"
  | "spec_draft"
  | "spec_approval"
  | "build_queued"
  | "building"
  | "qa_failed"
  | "qa_passed"
  | "deploy_approval"
  | "delivered";

export function sanitizeCustomerText(value: string, maxLength = 1000): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/```/g, "'''")
    .replace(/<\/?(?:system|assistant|developer|tool)[^>]*>/gi, "[filtered]")
    .trim()
    .slice(0, maxLength);
}

export function scoreLead(input: IntakeInput): number {
  let score = 0;
  if (input.usesCurrentPlatform) score += 15;
  if (supportsAutomationGoal(input.industryPack, input.automationGoal)) score += 20;
  if (["100_500", "501_1500"].includes(input.monthlyOrders)) score += 20;
  if (["1", "2_5"].includes(input.teamSize)) score += 10;
  if (input.dailyMinutes >= 30) score += 20;
  if (input.weeklyReportMinutes >= 30) score += 5;
  if (["overdue", "refunds", "low_stock", "scattered_numbers", "data_entry", "lead_followup", "scheduling", "document_backlog", "content_reuse"].includes(input.biggestProblem)) score += 10;
  if (input.implementationTiming === "within_30_days") score += 10;
  if (input.requestedScope === "read_only_report") score += 5;
  if (input.requestedScope === "draft_and_review") score += 10;
  if (input.requestedScope === "multi_platform") score -= 15;
  if (["write_back", "autonomous_external_action"].includes(input.requestedScope)) score -= 50;
  if (input.industry === "regulated") score -= 60;
  return Math.max(0, Math.min(100, score));
}

export function estimateMonthlyHours(input: IntakeInput): number {
  return Number(((input.dailyMinutes * 22 + input.weeklyReportMinutes * 4.33) / 60).toFixed(1));
}

export type AutomationEstimate = {
  currentMonthlyHours: number;
  recoverableHours: { low: number; high: number };
  monthlyValueMinor: { low: number; high: number };
  paybackMonths: { fast: number; slow: number } | null;
  riskTier: RiskTier;
  supportedGoal: boolean;
  qualified: boolean;
};

export function estimateAutomationOutcome(input: IntakeInput, setupMinor: number, monthlyMinor = 0): AutomationEstimate {
  const pack = getIndustryPack(input.industryPack);
  const currentMonthlyHours = estimateMonthlyHours(input);
  const scopeFactor = input.requestedScope === "read_only_report" ? 0.85 : input.requestedScope === "multi_platform" ? 0.75 : 1;
  const recoverableHours = {
    low: Number((currentMonthlyHours * pack.coverage.low * scopeFactor).toFixed(1)),
    high: Number((currentMonthlyHours * pack.coverage.high * scopeFactor).toFixed(1))
  };
  const monthlyValueMinor = {
    low: Math.round(recoverableHours.low * input.hourlyCostMinor),
    high: Math.round(recoverableHours.high * input.hourlyCostMinor)
  };
  const netMonthlyValue = {
    low: monthlyValueMinor.low - monthlyMinor,
    high: monthlyValueMinor.high - monthlyMinor
  };
  const paybackMonths = netMonthlyValue.low > 0 && netMonthlyValue.high > 0
    ? {
        fast: Number((setupMinor / netMonthlyValue.high).toFixed(1)),
        slow: Number((setupMinor / netMonthlyValue.low).toFixed(1))
      }
    : null;
  const riskTier = assessAutomationRisk({
    packId: input.industryPack,
    industry: input.industry,
    requestedScope: input.requestedScope
  });
  const supportedGoal = supportsAutomationGoal(input.industryPack, input.automationGoal);
  return {
    currentMonthlyHours,
    recoverableHours,
    monthlyValueMinor,
    paybackMonths,
    riskTier,
    supportedGoal,
    qualified: scoreLead(input) >= 65 && supportedGoal && riskTier !== "restricted"
  };
}
