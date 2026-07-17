import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminCookieOptions, createAdminSession, verifyAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  if (!verifyAdminPassword(String(form.get("password") || ""))) {
    return new NextResponse(null, { status: 303, headers: { location: "/admin/login?error=1" } });
  }
  const response = new NextResponse(null, { status: 303, headers: { location: "/admin" } });
  response.cookies.set(ADMIN_COOKIE, createAdminSession(), adminCookieOptions);
  return response;
}
