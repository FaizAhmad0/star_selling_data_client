import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ROLE_DASHBOARD: Record<string, string> = {
  user: "/dashboard",
  manager: "/manager",
  admin: "/admin",
  supervisor: "/supervisor",
  accountant: "/accountant",
};

const PROTECTED_ROUTES = ["/dashboard", "/admin", "/manager", "/supervisor", "/accountant"];

async function getUserFromToken(request: NextRequest): Promise<{ id: string; role: string } | null> {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.id === "string" && typeof payload.role === "string") {
      return { id: payload.id, role: payload.role };
    }
    return null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = await getUserFromToken(request);

  if (pathname === "/login") {
    if (user) {
      const dashboard = ROLE_DASHBOARD[user.role] ?? "/dashboard";
      return NextResponse.redirect(new URL(dashboard, request.url));
    }
    return NextResponse.next();
  }

  const isProtected = PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));

  if (!isProtected) {
    return NextResponse.next();
  }

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const allowedPath = ROLE_DASHBOARD[user.role] ?? "/dashboard";

  if (pathname === allowedPath || pathname.startsWith(allowedPath + "/")) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(allowedPath, request.url));
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
