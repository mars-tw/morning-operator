import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GET as createCheckout } from "@/app/api/payments/ecpay/checkout/route";
import { POST as receiveEcpayNotification } from "@/app/api/webhooks/payments/ecpay/route";
import type { IntakeDraft } from "@/lib/contracts";
import { closeDb, getDb } from "@/lib/db";
import { createEcpayCheckMacValue } from "@/lib/payments";
import { createLead } from "@/lib/repository";

let tempDir = "";
const environmentKeys = [
  "AUTOPILOT_DB_PATH",
  "AUTOPILOT_BASE_URL",
  "NEXT_PUBLIC_OFFER_CURRENCY",
  "NEXT_PUBLIC_OFFER_SETUP_MINOR",
  "ECPAY_ENVIRONMENT",
  "ECPAY_MERCHANT_ID",
  "ECPAY_HASH_KEY",
  "ECPAY_HASH_IV"
] as const;
const originalEnvironment = Object.fromEntries(environmentKeys.map((key) => [key, process.env[key]]));

beforeEach(() => {
  tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "autopilot-ecpay-test-"));
  process.env.AUTOPILOT_DB_PATH = path.join(tempDir, "test.db");
  process.env.AUTOPILOT_BASE_URL = "http://localhost:3000";
  process.env.NEXT_PUBLIC_OFFER_CURRENCY = "TWD";
  process.env.NEXT_PUBLIC_OFFER_SETUP_MINOR = "19800";
  process.env.ECPAY_ENVIRONMENT = "stage";
  process.env.ECPAY_MERCHANT_ID = "3002607";
  process.env.ECPAY_HASH_KEY = "test-hash-key";
  process.env.ECPAY_HASH_IV = "test-hash-iv";
  closeDb();
});

afterEach(() => {
  closeDb();
  fs.rmSync(tempDir, { recursive: true, force: true });
  for (const key of environmentKeys) {
    const value = originalEnvironment[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

const leadInput = {
  locale: "zh-TW",
  industryPack: "commerce_ops",
  primaryPlatform: "shopify",
  automationGoal: "operations_alerts",
  brandName: "綠界測試商店",
  email: "ecpay-test@example.com",
  storeUrl: "https://example.com",
  industry: "lifestyle",
  usesShopify: true,
  usesCurrentPlatform: true,
  monthlyOrders: "100_500",
  teamSize: "2_5",
  dailyMinutes: 45,
  weeklyReportMinutes: 90,
  biggestProblem: "low_stock",
  requestedScope: "read_only_report",
  implementationTiming: "within_30_days",
  hourlyCostMinor: 800,
  privacyConsent: true,
  marketingConsent: false,
  companyNote: ""
} satisfies IntakeDraft;

function hiddenFields(html: string): Record<string, string> {
  return Object.fromEntries(
    [...html.matchAll(/<input type="hidden" name="([^"]+)" value="([^"]*)">/g)]
      .map((match) => [match[1], match[2]])
  );
}

describe("ECPay checkout to signed callback", () => {
  it("records one fixed-price project even when the provider retries", async () => {
    const lead = createLead(leadInput);
    const checkout = await createCheckout(new NextRequest(
      `http://localhost:3000/api/payments/ecpay/checkout?leadId=${lead.id}`
    ));
    expect(checkout.status).toBe(200);
    const fields = hiddenFields(await checkout.text());
    expect(fields).toMatchObject({
      MerchantID: "3002607",
      TotalAmount: "19800",
      CustomField1: lead.id
    });
    expect(fields.MerchantTradeNo).toMatch(/^[A-Z0-9]{4,20}$/);

    const callback: Record<string, string> = {
      MerchantID: "3002607",
      MerchantTradeNo: fields.MerchantTradeNo,
      RtnCode: "1",
      RtnMsg: "Succeeded",
      TradeNo: "2607171234567890",
      TradeAmt: "19800",
      SimulatePaid: "1",
      CustomField1: lead.id
    };
    callback.CheckMacValue = createEcpayCheckMacValue(callback, "test-hash-key", "test-hash-iv");
    const rawBody = new URLSearchParams(callback).toString();
    const send = () => receiveEcpayNotification(new Request(
      "http://localhost:3000/api/webhooks/payments/ecpay",
      { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: rawBody }
    ));

    expect(await (await send()).text()).toBe("1|OK");
    expect(await (await send()).text()).toBe("1|OK");
    expect((getDb().prepare("SELECT COUNT(*) AS count FROM payment_attempts WHERE status = 'paid'").get() as { count: number }).count).toBe(1);
    expect((getDb().prepare("SELECT COUNT(*) AS count FROM payments").get() as { count: number }).count).toBe(1);
    expect((getDb().prepare("SELECT COUNT(*) AS count FROM projects").get() as { count: number }).count).toBe(1);
  });
});
