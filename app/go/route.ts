import { NextResponse } from 'next/server';

function clean(value: string | null, fallback: string) {
  const normalized = (value || '').trim().replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 80);
  return normalized || fallback;
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const ref = clean(url.searchParams.get('ref'), 'go');
  const source = clean(url.searchParams.get('source'), 'direct');
  const medium = clean(url.searchParams.get('medium'), 'share');
  const campaign = clean(url.searchParams.get('campaign'), ref);
  const content = clean(url.searchParams.get('content'), 'bag-upgrade-kit');
  const targetPath = url.searchParams.get('to') === 'shop' ? '/products' : '/weekend-golfer-bag-upgrade-kit';
  const target = new URL(`https://wyxgolfsupply.com${targetPath}`);

  target.searchParams.set('discount', 'WYX10');
  target.searchParams.set('ref', ref);
  target.searchParams.set('utm_source', source);
  target.searchParams.set('utm_medium', medium);
  target.searchParams.set('utm_campaign', campaign);
  target.searchParams.set('utm_content', content);

  return NextResponse.redirect(target, 302);
}
