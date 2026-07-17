import { NextResponse } from "next/server";
import { paymentSuccessSchema } from "@/lib/contracts";
import {
  hashPayload,
  parseEcpayPaymentNotification,
  verifyEcpayCheckMacValue
} from "@/lib/payments";
import { processPaymentSuccess, recordInvalidWebhook } from "@/lib/repository";
import { readSecret } from "@/lib/secrets";

export const runtime = "nodejs";

function reply(body: string, status = 200): NextResponse {
  return new NextResponse(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "text/plain; charset=utf-8"
    }
  });
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const payloadHash = hashPayload(rawBody);
  let merchantId = "";
  let hashKey = "";
  let hashIv = "";
  try {
    merchantId = readSecret("ECPAY_MERCHANT_ID");
    hashKey = readSecret("ECPAY_HASH_KEY");
    hashIv = readSecret("ECPAY_HASH_IV");
  } catch {
    return reply("0|ECPay is not configured", 503);
  }
  if (!merchantId || !hashKey || !hashIv) return reply("0|ECPay is not configured", 503);

  try {
    const { notification, parameters } = parseEcpayPaymentNotification(rawBody);
    const eventHint = `${notification.MerchantTradeNo}:${payloadHash.slice(0, 16)}`;
    const validSignature = verifyEcpayCheckMacValue(parameters, hashKey, hashIv);
    if (!validSignature || notification.MerchantID !== merchantId) {
      recordInvalidWebhook("ecpay", eventHint, payloadHash);
      return reply("0|Invalid notification", 401);
    }

    // ECPay uses RtnCode=1 for a completed payment. Acknowledging other signed
    // states prevents retry storms, but they never create a paid project.
    if (notification.RtnCode !== "1") return reply("1|OK");

    // SimulatePaid is accepted only when this deployment is explicitly wired
    // to ECPay's stage environment. It is never a production payment signal.
    if (notification.SimulatePaid === "1" && process.env.ECPAY_ENVIRONMENT !== "stage") {
      return reply("1|OK");
    }

    processPaymentSuccess(paymentSuccessSchema.parse({
      provider: "ecpay",
      providerEventId: notification.TradeNo,
      providerOrderId: notification.MerchantTradeNo,
      leadId: notification.CustomField1,
      amountMinor: notification.TradeAmt,
      currency: "TWD",
      payloadHash,
      signatureValid: true
    }));
    return reply("1|OK");
  } catch {
    return reply("0|Invalid notification", 400);
  }
}
