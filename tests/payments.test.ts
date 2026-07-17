import crypto from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  createEcpayCheckMacValue,
  createEcpayCheckoutParameters,
  ecpayCheckoutEndpoint,
  parseEcpayPaymentNotification,
  parseLemonOrder,
  verifyEcpayCheckMacValue,
  verifyLemonSignature
} from "@/lib/payments";

describe("Lemon Squeezy webhook", () => {
  it("uses the raw body HMAC SHA-256 signature", () => {
    const raw = '{"hello":"world"}'; const secret = "test-secret";
    const signature = crypto.createHmac("sha256", secret).update(raw).digest("hex");
    expect(verifyLemonSignature(raw, signature, secret)).toBe(true);
    expect(verifyLemonSignature(`${raw} `, signature, secret)).toBe(false);
  });
  it("extracts lead custom data and minor-unit totals", () => {
    const order = parseLemonOrder(JSON.stringify({ meta: { event_name: "order_created", custom_data: { lead_id: "b6d56f76-c571-4a62-ae31-709f00499c5d" } }, data: { id: "42", attributes: { currency: "TWD", total: 19800, status: "paid" } } }));
    expect(order).toMatchObject({ eventName: "order_created", eventId: "order_created:42", amountMinor: 19800, currency: "TWD" });
  });
});

describe("ECPay payment notification", () => {
  it("matches the official SHA-256 CheckMacValue test vector", () => {
    const parameters = {
      TradeDesc: "促銷方案",
      PaymentType: "aio",
      MerchantTradeDate: "2023/03/12 15:30:23",
      MerchantTradeNo: "ecpay20230312153023",
      MerchantID: "3002607",
      ReturnURL: "https://www.ecpay.com.tw/receive.php",
      ItemName: "Apple iphone 15",
      TotalAmount: "30000",
      ChoosePayment: "ALL",
      EncryptType: "1"
    };
    expect(createEcpayCheckMacValue(parameters, "pwFHCqoQZGmho4w6", "EkRm7iFT261dpevs"))
      .toBe("6C51C9E6888DE861FD62FB1DD17029FC742634498FD813DC43D4243B5685B840");
  });

  it("verifies every form field and extracts the lead mapping", () => {
    const parameters: Record<string, string> = {
      MerchantID: "3002607",
      MerchantTradeNo: "MO202607170001",
      RtnCode: "1",
      RtnMsg: "Succeeded",
      TradeNo: "2607171234567890",
      TradeAmt: "19800",
      SimulatePaid: "0",
      CustomField1: "b6d56f76-c571-4a62-ae31-709f00499c5d"
    };
    parameters.CheckMacValue = createEcpayCheckMacValue(parameters, "test-hash-key", "test-hash-iv");
    const rawBody = new URLSearchParams(parameters).toString();
    const parsed = parseEcpayPaymentNotification(rawBody);
    expect(verifyEcpayCheckMacValue(parsed.parameters, "test-hash-key", "test-hash-iv")).toBe(true);
    expect(parsed.notification).toMatchObject({ TradeAmt: 19800, SimulatePaid: "0", CustomField1: parameters.CustomField1 });
    parsed.parameters.TradeAmt = "1";
    expect(verifyEcpayCheckMacValue(parsed.parameters, "test-hash-key", "test-hash-iv")).toBe(false);
  });

  it("rejects duplicate form keys to avoid signature ambiguity", () => {
    expect(() => parseEcpayPaymentNotification("MerchantID=one&MerchantID=two"))
      .toThrow("Duplicate ECPay notification field");
  });

  it("creates a signed hosted-checkout POST with a Taipei timestamp", () => {
    const parameters = createEcpayCheckoutParameters({
      merchantId: "3002607",
      merchantTradeNo: "MO202607170001",
      leadId: "b6d56f76-c571-4a62-ae31-709f00499c5d",
      amountTwd: 19800,
      returnUrl: "https://operator.example/api/webhooks/payments/ecpay",
      clientBackUrl: "https://operator.example/zh-TW",
      hashKey: "test-hash-key",
      hashIv: "test-hash-iv",
      locale: "zh-TW",
      now: new Date("2026-07-17T04:34:56.000Z")
    });
    expect(parameters).toMatchObject({
      MerchantTradeDate: "2026/07/17 12:34:56",
      TotalAmount: "19800",
      CustomField1: "b6d56f76-c571-4a62-ae31-709f00499c5d"
    });
    expect(parameters.CheckMacValue).toMatch(/^[A-F0-9]{64}$/);
    expect(ecpayCheckoutEndpoint("stage")).toContain("payment-stage.ecpay.com.tw");
    expect(ecpayCheckoutEndpoint("production")).toContain("payment.ecpay.com.tw");
  });
});
