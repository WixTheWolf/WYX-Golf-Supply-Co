import { NextResponse } from 'next/server';
import { availableProducts, catalogCategories, categoryCount } from '@/lib/catalog';
import { getProducts } from '@/lib/shopify/products';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await getProducts();
    const available = availableProducts(products);
    return NextResponse.json({
      ok: true,
      source: 'shopify',
      products: products.length,
      availableForSale: available.length,
      categories: Object.fromEntries(catalogCategories.slice(1).map((category) => [category, categoryCount(available, category)]))
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Catalog check failed.' }, { status: 503 });
  }
}
