import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check for maintenance mode
  const maintenanceMode = process.env.MAINTENANCE_MODE === "true"

  if (
    maintenanceMode &&
    !pathname.startsWith("/_next") &&
    !pathname.includes("/api/") &&
    !pathname.startsWith("/maintenance")
  ) {
    return NextResponse.rewrite(new URL("/maintenance", request.url))
  }

  // For the demo, we'll skip authentication checks in middleware
  // since we're using client-side auth with localStorage
  // In a real app, you would use cookies or JWT tokens here

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|api|public).*)",
  ],
}

