import crypto from "node:crypto";

export const ADMIN_COOKIE = "autopilot_owner";
const SESSION_SECONDS = 12 * 60 * 60;

function config(): { password: string; secret: string } {
  const password = process.env.ADMIN_PASSWORD || "demo-only-change-me";
  const secret = process.env.ADMIN_SESSION_SECRET || "development-session-secret-change-before-production";
  if (process.env.NODE_ENV === "production") {
    if (password === "demo-only-change-me" || secret.length < 32) {
      throw new Error("Production requires a strong ADMIN_PASSWORD and ADMIN_SESSION_SECRET");
    }
  }
  return { password, secret };
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function verifyAdminPassword(candidate: string): boolean {
  return safeEqual(candidate, config().password);
}

export function createAdminSession(): string {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `owner.${expires}`;
  const signature = crypto.createHmac("sha256", config().secret).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export function verifyAdminSession(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "owner") return false;
  const expires = Number(parts[1]);
  if (!Number.isFinite(expires) || expires < Math.floor(Date.now() / 1000)) return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = crypto.createHmac("sha256", config().secret).update(payload).digest("hex");
  return safeEqual(parts[2], expected);
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_SECONDS
};

