import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTE_CONFIG } from "./types/auth.types";

// Các route không cần xác thực
const publicRoutes = ["/register", "/forgot-password", "/unauthorized"];

// Kiểm tra xem route có phải là public route không
const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.some((route) => pathname === route);
};

// Kiểm tra quyền truy cập cho route
const checkRouteAccess = (pathname: string, userRole: string): boolean => {
  // Tìm route config phù hợp
  const routeConfig = ROUTE_CONFIG.find((config) => {
    if (pathname.startsWith(config.path)) {
      return true;
    }
    if (config.children) {
      return config.children.some((child) => pathname.startsWith(child.path));
    }
    return false;
  });

  if (!routeConfig) {
    return false;
  }

  // Kiểm tra quyền truy cập
  if (routeConfig.roles.includes(userRole as any)) {
    return true;
  }

  // Kiểm tra quyền truy cập cho child routes
  if (routeConfig.children) {
    const childRoute = routeConfig.children.find((child) =>
      pathname.startsWith(child.path)
    );
    if (childRoute && childRoute.roles.includes(userRole as any)) {
      return true;
    }
  }

  return false;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  // Xử lý route "/" (trang đăng nhập)
  if (pathname === "/") {
    if (accessToken && userRole) {
      // Nếu đã đăng nhập, chuyển hướng đến dashboard tương ứng
      const dashboardPath =
        ROUTE_CONFIG.find((config) => config.roles.includes(userRole as any))
          ?.path || "/unauthorized";
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
    // Nếu chưa đăng nhập, cho phép truy cập trang đăng nhập
    return NextResponse.next();
  }

  // Cho phép truy cập public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Kiểm tra token và role cho các route được bảo vệ
  if (!accessToken || !userRole) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Kiểm tra quyền truy cập
  const hasAccess = checkRouteAccess(pathname, userRole);
  if (!hasAccess) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
