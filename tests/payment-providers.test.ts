import { describe, expect, it } from "vitest";
import { getPaymentProviderStatuses, paymentProviders } from "@/lib/payment-providers";

describe("payment provider catalog", () => {
  it("keeps executable and documented-only adapters explicit", () => {
    expect(new Set(paymentProviders.map((provider) => provider.id)).size).toBe(paymentProviders.length);
    expect(paymentProviders.find((provider) => provider.id === "ecpay")?.state).toBe("implemented");
    expect(paymentProviders.filter((provider) => provider.market === "taiwan").map((provider) => provider.id))
      .toEqual(["ecpay", "newebpay", "tappay", "line_pay"]);
  });

  it("reports readiness without exposing secret values", () => {
    const statuses = getPaymentProviderStatuses({
      NODE_ENV: "production",
      AUTOPILOT_BASE_URL: "https://operator.example.test",
      NEXT_PUBLIC_CHECKOUT_URL: "https://checkout.example.test",
      LEMON_SQUEEZY_WEBHOOK_SECRET: "lemon-secret-must-not-leak",
      ECPAY_ENVIRONMENT: "stage",
      ECPAY_MERCHANT_ID: "ecpay-merchant-must-not-leak",
      ECPAY_HASH_KEY: "ecpay-key-must-not-leak",
      ECPAY_HASH_IV: "ecpay-iv-must-not-leak"
    });
    expect(statuses.find((provider) => provider.id === "mock")?.configured).toBe(false);
    expect(statuses.find((provider) => provider.id === "lemon_squeezy")?.configured).toBe(true);
    expect(statuses.find((provider) => provider.id === "ecpay")?.configured).toBe(true);
    expect(JSON.stringify(statuses)).not.toContain("must-not-leak");
  });
});
