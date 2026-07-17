import crypto from "node:crypto";
import { describe, expect, it } from "vitest";
import { parseLemonOrder, verifyLemonSignature } from "@/lib/payments";

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

