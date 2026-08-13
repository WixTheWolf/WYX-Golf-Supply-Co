import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { indexableJournalSlugs } from '@/lib/indexableJournal';

const CORE_INDEXABLE_PATHS = new Set([
  '/',
  '/products',
  '/apparel',
  '/weekend-golfer-bag-upgrade-kit',
  '/golf-trip-gear',
  '/golf-gifts',
  '/golf-gifts-under-60',
  '/golf-gloves',
  '/golf-headcovers',
  '/the-bag-test',
  '/about',
  '/story',
  '/faq',
  '/shipping-returns',
  '/contact',
  '/privacy',
  '/journal'
]);

const INDEXABLE_JOURNAL_PATHS = new Set(indexableJournalSlugs.map((slug) => `/journal/${slug}`));

const INDEXABLE_KITS = new Set([
  '/kits/golf-trip-kit',
  '/kits/bag-upgrade-kit'
]);

const PERMANENT_REDIRECTS = new Map([
  ['/open', '/'],
  ['/first-sale', '/products'],
  ['/fathers-day-golf-gifts', '/golf-gifts'],
  ['/last-minute-fathers-day-golf-gifts', '/golf-gifts'],
  ['/lp/fathers-day', '/golf-gifts']
]);

function shouldIndex(pathname: string) {
  if (CORE_INDEXABLE_PATHS.has(pathname)) return true;
  if (INDEXABLE_KITS.has(pathname)) return true;
  if (INDEXABLE_JOURNAL_PATHS.has(pathname)) return true;
  if (pathname.startsWith('/products/')) return true;
  if (pathname.startsWith('/collections/')) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, '') || '/';
  const redirectPath = PERMANENT_REDIRECTS.get(pathname);
  const response = redirectPath
    ? NextResponse.redirect(new URL(`${redirectPath}${request.nextUrl.search}`, request.url), 308)
    : NextResponse.next();

  // The repo still contains a large legacy SEO/content layer with stale product,
  // price, and fulfillment claims. Keep those pages accessible for audit/redirect
  // work, but do not let search engines index them until they are rewritten.
  if (!redirectPath && !shouldIndex(pathname)) response.headers.set('X-Robots-Tag', 'noindex, follow');

  const ref = request.nextUrl.searchParams.get('ref') || request.nextUrl.searchParams.get('utm_campaign')?.replace(/^ref_/, '');
  if (ref) {
    response.cookies.set('wyx_ref', ref, {
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.svg|apple-icon|manifest.webmanifest|robots.txt|sitemap.xml).*)'],
};
