import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const userRole = request.cookies.get('user_role')?.value
  const { pathname } = request.nextUrl

  // Protected routes
  const isDashboardRoute = pathname.startsWith('/dashboard')
  const isAdminRoute = pathname.startsWith('/admin')
  const isAuthRoute = pathname === '/login' || pathname === '/register'

  // If trying to access dashboard/admin without token
  if ((isDashboardRoute || isAdminRoute) && !token) {
    const url = new URL('/login', request.url)
    return NextResponse.redirect(url)
  }

  // If trying to access admin without admin role
  if (isAdminRoute && userRole !== 'ADMIN') {
    const url = new URL('/dashboard', request.url)
    return NextResponse.redirect(url)
  }

  // If already logged in and trying to access login/register
  if (isAuthRoute && token) {
    const url = new URL('/dashboard', request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
}
