import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyAdminSession } from "@/lib/admin-auth";
import { approvalDecisionSchema } from "@/lib/contracts";
import { decideApproval } from "@/lib/repository";

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const form = await request.formData();
    const input = approvalDecisionSchema.parse({ decision: form.get("decision"), note: form.get("note") || "" });
    const { id } = await context.params;
    decideApproval(id, input.decision, input.note);
    return new NextResponse(null, { status: 303, headers: { location: "/admin" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "approval failed" }, { status: 400 });
  }
}
