import path from "node:path";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const script = path.resolve(process.cwd(), "scripts/validate-env.mjs");
const baseEnvironment: NodeJS.ProcessEnv = {
  ...process.env,
  NODE_ENV: "production",
  ADMIN_PASSWORD: "a-production-password",
  ADMIN_SESSION_SECRET: "a-session-secret-that-is-longer-than-thirty-two-characters",
  AUTOPILOT_BASE_URL: "https://operator.example.test",
  NEXT_PUBLIC_DEMO_MODE: "false",
  NEXT_PUBLIC_CHECKOUT_URL: "/api/payments/ecpay/checkout?leadId={leadId}",
  NEXT_PUBLIC_OFFER_CURRENCY: "TWD",
  NEXT_PUBLIC_OFFER_SETUP_MINOR: "19800",
  ECPAY_MERCHANT_ID: "merchant",
  ECPAY_HASH_KEY: "hash-key",
  ECPAY_HASH_IV: "hash-iv",
  ECPAY_ENVIRONMENT: "production"
};

describe("production payment configuration", () => {
  it("accepts an explicitly production ECPay checkout", () => {
    const output = execFileSync(process.execPath, [script], {
      cwd: process.cwd(),
      env: baseEnvironment,
      encoding: "utf8"
    });
    expect(output).toContain("Runtime configuration valid for production");
  });

  it("rejects an ECPay stage checkout when demo mode is disabled", () => {
    expect(() => execFileSync(process.execPath, [script], {
      cwd: process.cwd(),
      env: { ...baseEnvironment, ECPAY_ENVIRONMENT: "stage" },
      encoding: "utf8",
      stdio: "pipe"
    })).toThrow();
  });
});
