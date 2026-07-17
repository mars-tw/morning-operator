import { NextResponse } from "next/server";
import { createTranslator, resolveLocale } from "@/i18n";
import { estimateAutomationOutcome, intakeSchema } from "@/lib/contracts";
import { getPublicOffer } from "@/lib/public-config";
import { createLead } from "@/lib/repository";

export async function POST(request: Request) {
  let locale = resolveLocale(undefined);
  try {
    const body = await request.json() as Record<string, unknown>;
    locale = resolveLocale(typeof body.locale === "string" ? body.locale : undefined);
    const input = intakeSchema.parse(body);
    const offer = getPublicOffer(input.locale);
    const estimate = estimateAutomationOutcome(input, offer.setupMinor, offer.monthlyMinor);
    const lead = createLead(input);
    return NextResponse.json({
      leadId: lead.id,
      score: lead.score,
      fitScore: lead.score,
      estimatedMonthlyHours: estimate.currentMonthlyHours,
      currentMonthlyHours: estimate.currentMonthlyHours,
      recoverableHours: estimate.recoverableHours,
      monthlyValueMinor: estimate.monthlyValueMinor,
      paybackMonths: estimate.paybackMonths,
      currency: offer.currency,
      fractionDigits: offer.fractionDigits,
      riskTier: estimate.riskTier,
      supportedGoal: estimate.supportedGoal,
      qualified: estimate.qualified,
      disclaimer: createTranslator(input.locale)("estimate.disclaimer")
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      error: createTranslator(locale)("audit.error")
    }, { status: 400 });
  }
}
