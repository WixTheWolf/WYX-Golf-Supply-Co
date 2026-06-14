import { NextResponse } from 'next/server';

export function GET(request: Request) {
  const url = new URL(request.url);
  const ref = url.searchParams.get('ref') || 'go';
  const target = new URL('https://wyxgolfsupply.com/weekend-golfer-bag-upgrade-kit');
  target.searchParams.set('discount', 'WYX10');
  target.searchParams.set('ref', ref);
  target.searchParams.set('utm_source', 'direct');
  target.searchParams.set('utm_medium', 'share');
  target.searchParams.set('utm_campaign', ref);
  return NextResponse.redirect(target, 302);
}