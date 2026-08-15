import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/admin/login');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  // If user is accessing an admin page (other than login) and has no token, redirect to login
  if (isAdminPage && !isAuthPage && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If user is accessing login page but already has a token, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
