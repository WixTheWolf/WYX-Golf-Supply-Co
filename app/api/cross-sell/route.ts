import { NextRequest, NextResponse } from 'next/server';
import { availableProducts, categoryFor } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';
import { cleanText } from '@/lib/text';

export const dynamic = 'force-dynamic';

const MAX_PRICE = 25;
const MAX_ITEMS = 3;

/**
 * Returns up to 3 under-$25 complements for the cart drawer, excluding handles
 * already in the cart and spreading across categories so the row reads like
 * "round out the bag", not "more of the same".
 */
export async function GET(request: NextRequest) {
  try {
    const exclude = new Set(
      (request.nextUrl.searchParams.get('exclude') || '')
        .split(',')
        .map((handle) => handle.trim())
        .filter(Boolean)
    );

    const catalog = sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
    const KIND_WORDS = ['marker', 'towel', 'glove', 'brush', 'tee', 'retriever', 'headcover', 'grip', 'hat', 'ball'];
    const kindsOf = (title: string) => {
      const text = title.toLowerCase().replace(/ball markers?/g, 'marker');
      return new Set(KIND_WORDS.filter((kind) => text.includes(kind)));
    };
    const cartKinds = new Set<string>();
    for (const handle of exclude) {
      const product = catalog.find((item) => item.handle === handle);
      if (product) kindsOf(product.title).forEach((kind) => cartKinds.add(kind));
    }
    const seenCategories = new Set<string>();
    const picks: Array<{
      handle: string;
      title: string;
      price: { amount: string; currencyCode: string };
      image: string | null;
      variantId: string;
    }> = [];

    for (const product of catalog) {
      if (picks.length >= MAX_ITEMS) break;
      if (exclude.has(product.handle)) continue;
      if ([...kindsOf(product.title)].some((kind) => cartKinds.has(kind))) continue;
      if (Number(productPrice(product).amount) > MAX_PRICE) continue;
      const category = categoryFor(product);
      if (seenCategories.has(category)) continue;
      const variant = product.variants.find((item) => item.availableForSale);
      if (!variant) continue;
      seenCategories.add(category);
      picks.push({
        handle: product.handle,
        title: cleanText(product.title),
        price: productPrice(product),
        image: product.featuredImage?.url || product.images[0]?.url || null,
        variantId: variant.id
      });
    }

    return NextResponse.json({ items: picks });
  } catch (error) {
    console.error('[cross-sell]', error instanceof Error ? error.message : error);
    return NextResponse.json({ items: [] });
  }
}
