import crypto from "node:crypto";
import { z } from "zod";

const lemonPayloadSchema = z.object({
  meta: z.object({
    event_name: z.string(),
    custom_data: z.record(z.string(), z.unknown()).optional()
  }),
  data: z.object({
    id: z.string(),
    attributes: z.object({
      currency: z.string(),
      total: z.number().int().nonnegative(),
      status: z.string().optional()
    })
  })
});

export type LemonPayload = z.infer<typeof lemonPayloadSchema>;

export function hashPayload(rawBody: string): string {
  return crypto.createHash("sha256").update(rawBody).digest("hex");
}

export function verifyLemonSignature(rawBody: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const left = Buffer.from(expected, "utf8");
  const right = Buffer.from(signature, "utf8");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function parseLemonOrder(rawBody: string): {
  eventName: string;
  eventId: string;
  leadId: string;
  amountMinor: number;
  currency: string;
} {
  const payload = lemonPayloadSchema.parse(JSON.parse(rawBody)) as LemonPayload;
  const leadId = payload.meta.custom_data?.lead_id;
  if (typeof leadId !== "string") throw new Error("Lemon Squeezy custom_data.lead_id is required");
  return {
    eventName: payload.meta.event_name,
    eventId: `${payload.meta.event_name}:${payload.data.id}`,
    leadId,
    amountMinor: payload.data.attributes.total,
    currency: payload.data.attributes.currency.toUpperCase()
  };
}

