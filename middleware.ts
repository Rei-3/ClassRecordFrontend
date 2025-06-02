import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { decryptData } from "./lib/utils/authUtil";
import { jwtDecode } from "jwt-decode";

const roleBasedRoutes: Record<string, string[]> = {
  admin: [
    "/admin", 
    "/admin/**", 
  ],
  teacher: [
    "/teaching-loads", 
    "/teaching-loads/**", 
    "/subjects",
    "/subjects/**"
  ],
  // student: ["/teachingLoads"],
};

const protectedRoutes = [
  "/teaching-loads/**",
  "/teaching-loads",
  "/subjects/**",
  "/admin/**",
  "/admin"
];
const publicRoutes = ["/login", "/unauthorized", "/register", "/forgot-password", "/reset-password"];
const excludedRoutes = ["/_next/static","/unauthorized", "/_next/image", "/favicon.ico", "/api/auth", "/assets"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip excluded routes early
  if (excludedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Auth
  const encryptedToken = request.cookies.get("auth_token")?.value;
  let validToken = false;
  let user: { role?: string } | null = null;

  if (encryptedToken) {
    try {
      const decrypted = decryptData(encryptedToken);
      if (decrypted) {
        user = jwtDecode<{ role?: string }>(decrypted);
        validToken = true;
      }
    } catch (error) {
      // console.error("Token decode error:", error);
      error
    }
  }
  // console.log(encryptedToken)
  // console.log(validToken)
  // console.log(user)

  const isPublic = publicRoutes.some(route => pathname.startsWith(route));
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthenticated = !!validToken && !!user;

  // 🔒 Redirect unauthenticated users from protected routes
  if (!isAuthenticated && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 🚫 Redirect authenticated users from public routes to main
  if (isAuthenticated && isPublic) {
    return NextResponse.redirect(new URL("/teaching-loads", request.url));
  }

  // 🔐 Check role access if authenticated
  if (isAuthenticated && !isPublic) {
    const roleRoutes = roleBasedRoutes[user?.role ?? ""] ?? [];
    const hasAccess = roleRoutes.some(route => pathname.startsWith(route));

    if (!hasAccess) {
      console.warn(`Access denied for ${user?.role} on ${pathname}`);
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};
