import { NextResponse } from 'next/server';

export function middleware(request) {
    
  const isInMaintenanceMode = process.env.MAINTENANCE_MODE === 'true';

  if (isInMaintenanceMode && request.nextUrl.pathname !== '/maintenance') {
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};