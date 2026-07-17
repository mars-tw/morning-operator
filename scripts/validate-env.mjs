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
}

process.stdout.write(`Runtime configuration valid for ${isProduction ? "production" : "development"}.\n`);
