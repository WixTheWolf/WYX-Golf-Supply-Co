import type { Metadata } from 'next';
import type { Product } from '@/types/shopify';
import { availableProducts } from '@/lib/catalog';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { sortByQuality } from '@/lib/productQuality';
import { getProducts } from '@/lib/shopify/products';

export async function loadMerchCatalog() {
  return sortByQuality(coreMerchProducts(availableProducts(await getProducts())));
}

export function hiddenGemProducts(products: Product[], limit = 12) {
  return products
    .filter((p) => (p.tags || []).some((t) => t.toLowerCase() === 'hidden-gem'))
    .slice(0, limit);
}

export function trainingAidProducts(products: Product[], limit = 12) {
  return products
    .filter((p) => /training|trainer|putting|chipping|divot board|alignment|practice|swing/i.test(`${p.title} ${p.handle} ${(p.tags || []).join(' ')}`))
    .slice(0, limit);
}

/** Prevent thin SEO pages with fewer than 3 live products from indexing. */
export function thinPageRobots(productCount: number): Pick<Metadata, 'robots'> | Record<string, never> {
  return productCount < 3 ? { robots: { index: false, follow: true } } : {};
}