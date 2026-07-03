import { NextResponse } from "next/server";

export function proxy(request) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname === "/admin/login";
  const authenticated = request.cookies.get("authenticated")?.value === "true";

  if (isAdminRoute && !isLoginRoute && !authenticated) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isLoginRoute && authenticated) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
