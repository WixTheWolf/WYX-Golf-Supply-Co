import { NextResponse } from 'next/server';
import { isAuthorizedAdminRequest, unauthorizedResponse } from '@/lib/adminAuth';
import { getUserErrors, shopifyAdminFetch } from '@/lib/shopify/adminClient';

export const dynamic = 'force-dynamic';

const PRODUCTS = `#graphql
query ProductsToClean {
  products(first: 100, query: "vendor:'Pins and Aces'") {
    nodes { id handle title vendor productType tags }
  }
}`;

const UPDATE_PRODUCT = `#graphql
mutation ProductTextUpdate($product: ProductUpdateInput!) {
  productUpdate(product: $product) {
    product { id handle title }
    userErrors { field message }
  }
}`;

const bagMap = [
  ['obsidian', 'Player Preferred Golf Bag - Obsidian', 'player-preferred-golf-bag-obsidian'],
  ['domino', 'Player Preferred Golf Bag - Domino', 'player-preferred-golf-bag-domino'],
  ['flat ash', 'Player Preferred Golf Bag - Flat Ash', 'player-preferred-golf-bag-flat-ash'],
  ['golf of america', 'Player Preferred Golf Bag - Golf of America', 'player-preferred-golf-bag-golf-of-america']
] as const;

function errors(payload: Record<string, any>) {
  return getUserErrors(payload).map((error: any) => error.message).filter(Boolean);
}

function plannedUpdate(product: any) {
  const text = `${product.title} ${product.handle}`.toLowerCase();
  const match = bagMap.find(([needle]) => text.includes(needle));
  if (!match || !text.includes('player-preferred')) return null;
  const [, title, handle] = match;
  if (product.title === title && product.handle === handle) return null;
  return { title, handle };
}

export async function POST(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();

  try {
    const data = await shopifyAdminFetch<any>(PRODUCTS);
    const updates: Array<{ previousTitle: string; title: string; previousHandle: string; handle: string }> = [];

    for (const product of data.products.nodes) {
      const next = plannedUpdate(product);
      if (!next) continue;
      const result = await shopifyAdminFetch<any>(UPDATE_PRODUCT, { product: { id: product.id, title: next.title, handle: next.handle } });
      const updateErrors = errors(result);
      if (updateErrors.length) throw new Error(`${product.title}: ${updateErrors.join(', ')}`);
      updates.push({ previousTitle: product.title, previousHandle: product.handle, title: next.title, handle: next.handle });
    }

    return NextResponse.json({ ok: true, updates });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Product text cleanup failed.' }, { status: 500 });
  }
}
