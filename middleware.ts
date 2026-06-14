import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get('ref') || request.nextUrl.searchParams.get('utm_campaign')?.replace(/^ref_/, '');
  if (!ref) return NextResponse.next();

  const response = NextResponse.next();
  response.cookies.set('wyx_ref', ref, {
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax',
  });
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};