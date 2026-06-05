import { NextRequest, NextResponse } from 'next/server';

const storefrontDomain = 'wyxgolfsupply.com';
const checkoutDomain = 'wyxgolfsupply.myshopify.com';
const checkoutPathPrefixes = ['/cart/c', '/checkout', '/checkouts', '/wallets', '/account'];

export function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const isStorefrontHost = nextUrl.hostname === storefrontDomain || nextUrl.hostname.endsWith(`.${storefrontDomain}`);
  const isCheckoutPath = checkoutPathPrefixes.some((prefix) => nextUrl.pathname === prefix || nextUrl.pathname.startsWith(`${prefix}/`));

  if (isStorefrontHost && isCheckoutPath) {
    const redirectUrl = nextUrl.clone();
    redirectUrl.hostname = checkoutDomain;
    return NextResponse.redirect(redirectUrl, 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cart/c/:path*', '/checkout/:path*', '/checkouts/:path*', '/wallets/:path*', '/account/:path*']
};
