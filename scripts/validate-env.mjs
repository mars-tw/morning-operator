const isProduction = process.env.NODE_ENV === "production";

function fail(message) {
  process.stderr.write(`Configuration error: ${message}\n`);
  process.exit(1);
}

function validUrl(value) {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

function hasSecret(name) {
  return Boolean((process.env[name] || "").trim() || (process.env[`${name}_FILE`] || "").trim());
}

if (isProduction) {
  const password = process.env.ADMIN_PASSWORD || "";
  const secret = process.env.ADMIN_SESSION_SECRET || "";
  const baseUrl = validUrl(process.env.AUTOPILOT_BASE_URL || "");

  if (!password || password === "demo-only-change-me" || password.length < 14) {
    fail("ADMIN_PASSWORD must be a non-demo value with at least 14 characters in production.");
  }
  if (secret.length < 32) {
    fail("ADMIN_SESSION_SECRET must contain at least 32 characters in production.");
  }
  if (!baseUrl) {
    fail("AUTOPILOT_BASE_URL must be an absolute URL in production.");
  }
  if (baseUrl.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(baseUrl.hostname)) {
    fail("AUTOPILOT_BASE_URL must use HTTPS outside localhost.");
  }
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "false" && !process.env.NEXT_PUBLIC_CHECKOUT_URL) {
    fail("NEXT_PUBLIC_CHECKOUT_URL is required when demo mode is disabled.");
  }
  const checkoutUrl = process.env.NEXT_PUBLIC_CHECKOUT_URL || "";
  if (checkoutUrl.includes("/api/payments/ecpay/checkout")) {
    if ((process.env.NEXT_PUBLIC_OFFER_CURRENCY || "").toUpperCase() !== "TWD") {
      fail("ECPay checkout requires NEXT_PUBLIC_OFFER_CURRENCY=TWD.");
    }
    if (!Number.isSafeInteger(Number(process.env.NEXT_PUBLIC_OFFER_SETUP_MINOR))
      || Number(process.env.NEXT_PUBLIC_OFFER_SETUP_MINOR) <= 0) {
      fail("ECPay checkout requires a positive integer NEXT_PUBLIC_OFFER_SETUP_MINOR.");
    }
    if (!hasSecret("ECPAY_MERCHANT_ID") || !hasSecret("ECPAY_HASH_KEY") || !hasSecret("ECPAY_HASH_IV")) {
      fail("ECPay checkout requires MerchantID, HashKey, and HashIV secret configuration.");
    }
    if (!["stage", "production"].includes(process.env.ECPAY_ENVIRONMENT || "")) {
      fail("ECPAY_ENVIRONMENT must be stage or production.");
    }
    if (process.env.NEXT_PUBLIC_DEMO_MODE === "false" && process.env.ECPAY_ENVIRONMENT !== "production") {
      fail("A live non-demo checkout cannot use the ECPay stage environment.");
    }
  }
}

process.stdout.write(`Runtime configuration valid for ${isProduction ? "production" : "development"}.\n`);
