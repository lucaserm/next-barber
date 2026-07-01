import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { resolveLocale } from "./i18n/detect";

const publicRoutes = ["/admin/login", "/agendar"];

const protectedRoutes = ["/admin"];

// Detect the visitor's locale from Accept-Language and persist it in the
// NEXT_LOCALE cookie on first visit. Applied to any response we return so the
// cookie is set regardless of which auth branch runs.
function withLocaleCookie(request: NextRequest, response: NextResponse) {
  if (!request.cookies.get("NEXT_LOCALE")) {
    const locale = resolveLocale(request.headers.get("accept-language"));
    response.cookies.set("NEXT_LOCALE", locale, {
      path: "/",
      maxAge: 31536000,
    });
  }
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (publicRoutes.some((route) => pathname === route)) {
    return withLocaleCookie(request, NextResponse.next());
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      // Redirecionar para login se não tiver token
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return withLocaleCookie(request, NextResponse.next());
  }

  return withLocaleCookie(request, NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|public).*)"],
};
