import { NextResponse } from 'next/server';
import { availableProducts } from '@/lib/catalog';
import { productFeedItem } from '@/lib/feed';
import { getProducts } from '@/lib/shopify/products';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = availableProducts(await getProducts()).map(productFeedItem);
  return NextResponse.json({
    ok: true,
    updatedAt: new Date().toISOString(),
    products
  });
}
