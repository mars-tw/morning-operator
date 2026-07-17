import { NextResponse } from "next/server";
import { createTranslator, resolveLocale } from "@/i18n";
import { intakeSchema } from "@/lib/contracts";
import { createLead } from "@/lib/repository";

export async function POST(request: Request) {
  let locale = resolveLocale(undefined);
  try {
    const body = await request.json() as Record<string, unknown>;
    locale = resolveLocale(typeof body.locale === "string" ? body.locale : undefined);
    const input = intakeSchema.parse(body);
    const lead = createLead(input);
    return NextResponse.json({
      leadId: lead.id,
      score: lead.score,
      estimatedMonthlyHours: lead.estimated_monthly_hours,
      qualified: lead.score >= 70
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      error: createTranslator(locale)("audit.error")
    }, { status: 400 });
  }
}
