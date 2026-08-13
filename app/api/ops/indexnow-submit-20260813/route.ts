import { NextResponse } from 'next/server';
import { availableProducts } from '@/lib/catalog';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { getProducts } from '@/lib/shopify/products';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const key = '91a7ced37b4f44e6890fa650d0991a8a';
const base = 'https://wyxgolfsupply.com';

const corePaths = [
  '/',
  '/products',
  '/apparel',
  '/golf-headcovers',
  '/golf-gloves',
  '/golf-trip-gear',
  '/golf-gifts',
  '/golf-gifts-under-60',
  '/best-golf-accessories',
  '/the-bag-test',
  '/shipping-returns',
  '/about',
  '/story',
  '/faq',
  '/contact'
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get('confirm') !== 'submit-curated-wyx') {
    return NextResponse.json({ ok: false, error: 'confirmation-required' }, { status: 400, headers: { 'cache-control': 'no-store' } });
  }

  const products = coreMerchProducts(availableProducts(await getProducts()));
  const urlList = Array.from(new Set([
    ...corePaths.map((path) => `${base}${path}`),
    ...products.map((product) => `${base}/products/${product.handle}`)
  ]));

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: 'wyxgolfsupply.com',
      key,
      keyLocation: `${base}/${key}.txt`,
      urlList
    })
  });

  return NextResponse.json({
    ok: response.ok,
    status: response.status,
    submitted: urlList.length,
    products: products.length
  }, { status: response.ok ? 200 : 502, headers: { 'cache-control': 'no-store' } });
}
