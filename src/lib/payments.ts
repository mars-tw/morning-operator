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

const ecpayPaymentNotificationSchema = z.object({
  MerchantID: z.string().min(1).max(20),
  MerchantTradeNo: z.string().min(1).max(40),
  RtnCode: z.string().min(1).max(10),
  RtnMsg: z.string().max(200).default(""),
  TradeNo: z.string().min(1).max(40),
  TradeAmt: z.coerce.number().int().positive().max(1_000_000_000),
  PaymentDate: z.string().max(30).optional(),
  PaymentType: z.string().max(50).optional(),
  PaymentTypeChargeFee: z.string().max(30).optional(),
  TradeDate: z.string().max(30).optional(),
  SimulatePaid: z.enum(["0", "1"]).default("0"),
  CustomField1: z.string().min(1).max(50),
  CustomField2: z.string().max(50).optional(),
  CustomField3: z.string().max(50).optional(),
  CustomField4: z.string().max(50).optional(),
  CheckMacValue: z.string().regex(/^[a-fA-F0-9]{64}$/)
}).passthrough();

export type LemonPayload = z.infer<typeof lemonPayloadSchema>;
export type EcpayPaymentNotification = z.infer<typeof ecpayPaymentNotificationSchema>;

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

function compareAsciiCaseInsensitive(left: string, right: string): number {
  const a = left.toLowerCase();
  const b = right.toLowerCase();
  return a < b ? -1 : a > b ? 1 : 0;
}

function ecpayUrlEncode(value: string): string {
  return encodeURIComponent(value)
    .replace(/%20/g, "+")
    .replace(/%2D/gi, "-")
    .replace(/%5F/gi, "_")
    .replace(/%2E/gi, ".")
    .replace(/%21/gi, "!")
    .replace(/%2A/gi, "*")
    .replace(/%28/gi, "(")
    .replace(/%29/gi, ")");
}

export function createEcpayCheckMacValue(
  parameters: Record<string, string | number>,
  hashKey: string,
  hashIv: string
): string {
  if (!hashKey || !hashIv) throw new Error("ECPay HashKey and HashIV are required");
  const serialized = Object.entries(parameters)
    .filter(([key]) => key.toLowerCase() !== "checkmacvalue")
    .sort(([left], [right]) => compareAsciiCaseInsensitive(left, right))
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("&");
  const encoded = ecpayUrlEncode(`HashKey=${hashKey}&${serialized}&HashIV=${hashIv}`).toLowerCase();
  return crypto.createHash("sha256").update(encoded).digest("hex").toUpperCase();
}

export function verifyEcpayCheckMacValue(
  parameters: Record<string, string>,
  hashKey: string,
  hashIv: string
): boolean {
  const supplied = parameters.CheckMacValue || "";
  if (!/^[a-fA-F0-9]{64}$/.test(supplied) || !hashKey || !hashIv) return false;
  const expected = createEcpayCheckMacValue(parameters, hashKey, hashIv);
  const left = Buffer.from(expected, "utf8");
  const right = Buffer.from(supplied.toUpperCase(), "utf8");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function parseEcpayPaymentNotification(rawBody: string): {
  notification: EcpayPaymentNotification;
  parameters: Record<string, string>;
} {
  if (!rawBody || rawBody.length > 64 * 1024) throw new Error("Invalid ECPay notification body");
  const form = new URLSearchParams(rawBody);
  const parameters: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (!key || key.length > 64 || value.length > 4096) throw new Error("Invalid ECPay notification field");
    if (Object.hasOwn(parameters, key)) throw new Error("Duplicate ECPay notification field");
    parameters[key] = value;
  }
  return {
    notification: ecpayPaymentNotificationSchema.parse(parameters),
    parameters
  };
}

function taipeiTimestamp(date: Date): string {
  const values = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Taipei",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23"
    }).formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
  );
  return `${values.year}/${values.month}/${values.day} ${values.hour}:${values.minute}:${values.second}`;
}

export function createEcpayMerchantTradeNo(date = new Date()): string {
  const time = Math.floor(date.getTime() / 1000).toString(36).toUpperCase();
  const random = crypto.randomBytes(6).toString("hex").toUpperCase();
  return `MO${time}${random}`.slice(0, 20);
}

export function ecpayCheckoutEndpoint(environment: "stage" | "production"): string {
  return environment === "production"
    ? "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5"
    : "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5";
}

export function createEcpayCheckoutParameters(input: {
  merchantId: string;
  merchantTradeNo: string;
  leadId: string;
  amountTwd: number;
  returnUrl: string;
  clientBackUrl: string;
  hashKey: string;
  hashIv: string;
  locale: string;
  now?: Date;
}): Record<string, string> {
  if (!/^[A-Za-z0-9]{1,10}$/.test(input.merchantId)) throw new Error("Invalid ECPay merchant ID");
  if (!/^[A-Za-z0-9]{4,20}$/.test(input.merchantTradeNo)) throw new Error("Invalid ECPay merchant trade number");
  if (!Number.isSafeInteger(input.amountTwd) || input.amountTwd <= 0) throw new Error("Invalid ECPay TWD amount");
  for (const candidate of [input.returnUrl, input.clientBackUrl]) {
    if (candidate.length > 200) throw new Error("ECPay URL is too long");
    new URL(candidate);
  }
  const parameters: Record<string, string> = {
    MerchantID: input.merchantId,
    MerchantTradeNo: input.merchantTradeNo,
    MerchantTradeDate: taipeiTimestamp(input.now || new Date()),
    PaymentType: "aio",
    TotalAmount: String(input.amountTwd),
    TradeDesc: "Morning Operator setup",
    ItemName: "Morning Operator setup",
    ReturnURL: input.returnUrl,
    ChoosePayment: "ALL",
    EncryptType: "1",
    ClientBackURL: input.clientBackUrl,
    CustomField1: input.leadId,
    Language: input.locale === "ja" ? "JPN" : input.locale === "zh-TW" ? "" : "ENG"
  };
  if (!parameters.Language) delete parameters.Language;
  parameters.CheckMacValue = createEcpayCheckMacValue(parameters, input.hashKey, input.hashIv);
  return parameters;
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
