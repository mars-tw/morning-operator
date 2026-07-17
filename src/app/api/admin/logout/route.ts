import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const response = new NextResponse(null, { status: 303, headers: { location: "/admin/login" } });
  response.cookies.set(ADMIN_COOKIE, "", { path: "/", expires: new Date(0) });
  return response;
}
