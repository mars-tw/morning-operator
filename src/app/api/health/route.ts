import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    getDb().prepare("SELECT 1").get();
    return NextResponse.json({ status: "ok", database: "ready", time: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "error", database: "unavailable" }, { status: 503 });
  }
}

