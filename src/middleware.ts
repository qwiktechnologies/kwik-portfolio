import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const STAFF = new Set(["SUPER_ADMIN", "ADMIN", "STAFF"]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("qt_session")?.value;
  const login = request.nextUrl.clone();
  login.pathname = "/login";
  login.searchParams.set("next", pathname);

  if (!token || !process.env.AUTH_SECRET) return NextResponse.redirect(login);

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
    const role = String(payload.role || "");
    if (pathname.startsWith("/admin") && !STAFF.has(role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/admin/stripe") && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if ((pathname.startsWith("/admin/people") || pathname.startsWith("/admin/contact")) && role === "STAFF") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(login);
  }
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/account", "/account/:path*", "/checkout"],
};
