import { NextResponse } from "next/server";
import { paymentSuccessSchema } from "@/lib/contracts";
import { hashPayload, parseLemonOrder, verifyLemonSignature } from "@/lib/payments";
import { processPaymentSuccess, recordInvalidWebhook } from "@/lib/repository";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const payloadHash = hashPayload(rawBody);
  const signature = request.headers.get("x-signature") || "";
  const eventHeader = request.headers.get("x-event-name") || "unknown";
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || "";
  if (!verifyLemonSignature(rawBody, signature, secret)) {
    recordInvalidWebhook("lemon_squeezy", `${eventHeader}:${payloadHash.slice(0, 16)}`, payloadHash);
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }
  try {
    const order = parseLemonOrder(rawBody);
    if (order.eventName !== "order_created") return NextResponse.json({ received: true, ignored: true });
    const result = processPaymentSuccess(paymentSuccessSchema.parse({
      provider: "lemon_squeezy",
      providerEventId: order.eventId,
      leadId: order.leadId,
      amountMinor: order.amountMinor,
      currency: order.currency,
      payloadHash,
      signatureValid: true
    }));
    return NextResponse.json({ received: true, duplicate: result.duplicate, projectId: result.projectId });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "webhook failed" }, { status: 400 });
  }
}
