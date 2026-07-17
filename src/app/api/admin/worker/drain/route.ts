import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";
import { drainJobs } from "@/lib/automation";

export async function POST(request: NextRequest) {
  if (!verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const e2eLoopback = process.env.AUTOPILOT_E2E_MODE === "true"
    && /^http:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?$/i.test(process.env.AUTOPILOT_BASE_URL || "");
  if (
    process.env.AUTOPILOT_AI_MODE !== "mock"
    || process.env.NEXT_PUBLIC_DEMO_MODE === "false"
    || (process.env.NODE_ENV === "production" && !e2eLoopback)
  ) {
    return NextResponse.json({ error: "mock worker drain is disabled" }, { status: 404 });
  }
  const processed = await drainJobs();
  return NextResponse.json({ processed });
}
