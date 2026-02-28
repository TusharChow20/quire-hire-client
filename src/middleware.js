import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Block non-admins from admin-only routes
    const adminRoutes = ["/dashboard/jobs", "/dashboard/analytics"];
    if (
      adminRoutes.some((r) => pathname.startsWith(r)) &&
      session.user?.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Redirect logged-in users away from login/signup
  if ((pathname === "/login" || pathname === "/signup") && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
