import { NextRequest, NextResponse } from "next/server";
import {
  createEcpayCheckoutParameters,
  createEcpayMerchantTradeNo,
  ecpayCheckoutEndpoint
} from "@/lib/payments";
import { getPublicOffer } from "@/lib/public-config";
import { createPaymentAttempt, getLead } from "@/lib/repository";
import { readSecret } from "@/lib/secrets";

export const runtime = "nodejs";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character] || character);
}

export async function GET(request: NextRequest) {
  try {
    const leadId = request.nextUrl.searchParams.get("leadId") || "";
    const lead = getLead(leadId);
    if (!lead || lead.status !== "qualified") {
      return NextResponse.json({ error: "checkout is not available" }, { status: 404 });
    }
    const environment = process.env.ECPAY_ENVIRONMENT;
    if (environment !== "stage" && environment !== "production") {
      return NextResponse.json({ error: "ECPay environment is not configured" }, { status: 503 });
    }
    const merchantId = readSecret("ECPAY_MERCHANT_ID");
    const hashKey = readSecret("ECPAY_HASH_KEY");
    const hashIv = readSecret("ECPAY_HASH_IV");
    if (!merchantId || !hashKey || !hashIv) {
      return NextResponse.json({ error: "ECPay is not configured" }, { status: 503 });
    }
    const configuredBaseUrl = process.env.AUTOPILOT_BASE_URL;
    if (!configuredBaseUrl) return NextResponse.json({ error: "base URL is not configured" }, { status: 503 });
    const baseUrl = new URL(configuredBaseUrl);
    if (environment === "production" && baseUrl.protocol !== "https:") {
      return NextResponse.json({ error: "production checkout requires HTTPS" }, { status: 503 });
    }
    const offer = getPublicOffer(lead.locale === "zh-TW" || lead.locale === "ja" || lead.locale === "es" ? lead.locale : "en");
    if (offer.currency !== "TWD") {
      return NextResponse.json({ error: "ECPay checkout requires a TWD offer" }, { status: 503 });
    }
    const providerOrderId = createEcpayMerchantTradeNo();
    const callbackUrl = new URL("/api/webhooks/payments/ecpay", baseUrl).toString();
    const clientBackUrl = new URL(`/${lead.locale}`, baseUrl).toString();
    const parameters = createEcpayCheckoutParameters({
      merchantId,
      merchantTradeNo: providerOrderId,
      leadId: lead.id,
      amountTwd: offer.setupMinor,
      returnUrl: callbackUrl,
      clientBackUrl,
      hashKey,
      hashIv,
      locale: lead.locale
    });
    createPaymentAttempt({
      provider: "ecpay",
      providerOrderId,
      leadId: lead.id,
      amountMinor: offer.setupMinor,
      currency: offer.currency
    });
    const action = ecpayCheckoutEndpoint(environment);
    const fields = Object.entries(parameters)
      .map(([key, value]) => `<input type="hidden" name="${escapeHtml(key)}" value="${escapeHtml(value)}">`)
      .join("");
    const html = `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>前往綠界安全付款</title></head><body><p>正在前往綠界安全付款頁…</p><form method="post" action="${escapeHtml(action)}">${fields}<button type="submit">繼續付款</button></form><script>document.forms[0].submit()</script></body></html>`;
    return new NextResponse(html, {
      headers: {
        "cache-control": "no-store",
        "content-security-policy": `default-src 'none'; script-src 'unsafe-inline'; style-src 'none'; form-action ${action}; base-uri 'none'; frame-ancestors 'none'`,
        "content-type": "text/html; charset=utf-8",
        "referrer-policy": "no-referrer",
        "x-content-type-options": "nosniff"
      }
    });
  } catch {
    return NextResponse.json({ error: "checkout could not be created" }, { status: 400 });
  }
}
