import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";
import { paymentSuccessSchema } from "@/lib/contracts";
import { processPaymentSuccess } from "@/lib/repository";

export async function POST(request: NextRequest) {
  const e2eLoopback = process.env.AUTOPILOT_E2E_MODE === "true"
    && /^http:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/i.test(process.env.AUTOPILOT_BASE_URL || "");
  if (process.env.NODE_ENV === "production" && !e2eLoopback) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  if (!verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const form = await request.formData();
    const leadId = String(form.get("leadId") || "");
    const amountMinor = Number(form.get("amountMinor") || process.env.NEXT_PUBLIC_OFFER_SETUP_MINOR || 65000);
    const currency = String(form.get("currency") || process.env.NEXT_PUBLIC_OFFER_CURRENCY || "USD").toUpperCase();
    const eventId = `mock:${leadId}:${Date.now()}`;
    processPaymentSuccess(paymentSuccessSchema.parse({
      provider: "mock",
      providerEventId: eventId,
      leadId,
      amountMinor,
      currency,
      payloadHash: crypto.createHash("sha256").update(eventId).digest("hex"),
      signatureValid: true
    }));
    return new NextResponse(null, { status: 303, headers: { location: "/admin" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "mock payment failed" }, { status: 400 });
  }
}
