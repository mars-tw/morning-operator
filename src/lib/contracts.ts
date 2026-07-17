import { z } from "zod";
import { supportedLocales } from "@/i18n";

export const intakeSchema = z.object({
  locale: z.enum(supportedLocales).default("en"),
  brandName: z.string().trim().min(2).max(80),
  email: z.email().max(160),
  storeUrl: z.url().max(300),
  industry: z.enum(["food", "lifestyle", "fashion", "other", "regulated"]),
  usesShopify: z.boolean(),
  monthlyOrders: z.enum(["under_100", "100_500", "501_1500", "over_1500"]),
  teamSize: z.enum(["1", "2_5", "6_plus"]),
  dailyMinutes: z.number().int().min(0).max(600),
  weeklyReportMinutes: z.number().int().min(0).max(1200),
  biggestProblem: z.enum(["overdue", "refunds", "low_stock", "scattered_numbers"]),
  requestedScope: z.enum(["read_only_report", "write_back", "multi_platform"]),
  implementationTiming: z.enum(["within_30_days", "one_to_three_months", "researching"]),
  privacyConsent: z.literal(true),
  marketingConsent: z.boolean().default(false),
  companyNote: z.string().trim().max(1000).default("")
});

export type IntakeInput = z.infer<typeof intakeSchema>;

export const paymentSuccessSchema = z.object({
  provider: z.enum(["mock", "lemon_squeezy", "ecpay"]),
  providerEventId: z.string().min(4).max(200),
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
  if (input.usesShopify) score += 30;
  if (["100_500", "501_1500"].includes(input.monthlyOrders)) score += 20;
  if (["1", "2_5"].includes(input.teamSize)) score += 10;
  if (input.dailyMinutes >= 30) score += 15;
  if (["overdue", "refunds", "low_stock", "scattered_numbers"].includes(input.biggestProblem)) score += 15;
  if (input.implementationTiming === "within_30_days") score += 10;
  if (input.requestedScope !== "read_only_report") score -= 30;
  if (input.industry === "regulated") score -= 50;
  return Math.max(0, Math.min(100, score));
}

export function estimateMonthlyHours(input: IntakeInput): number {
  return Number(((input.dailyMinutes * 22 + input.weeklyReportMinutes * 4.33) / 60).toFixed(1));
}
