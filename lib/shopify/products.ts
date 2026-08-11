import { availableProducts } from '@/lib/catalog';
import { demoProduct, demoProducts } from '@/lib/demo';
import type { Product } from '@/types/shopify';
import { hasShopify, reshapeProduct, shopifyFetch } from './client';
import { COLLECTION_BY_HANDLE_QUERY, PRODUCT_BY_HANDLE_QUERY, PRODUCTS_QUERY } from './queries';

const ISR = { next: { revalidate: 300 } };
type ProductQueryOptions = { fresh?: boolean };

export async function getProducts(options: ProductQueryOptions = {}) {
  if (!hasShopify) return demoProducts;
  try {
    const data = await shopifyFetch<any>(PRODUCTS_QUERY, { first: 250 }, options.fresh ? { cache: 'no-store' } : ISR);
    return data.products.edges.map((e: any) => reshapeProduct(e.node));
  } catch (err) {
    console.error('[shopify] getProducts failed, falling back to demo data:', err);
    return demoProducts;
  }
}

/** Public product lookup. A Shopify product can exist and be active while still
 * being withheld from WYX because fulfillment, supplier review, media, or other
 * storefront gates have not passed. Those products resolve as unavailable here. */
export async function getProduct(handle: string) {
  if (!hasShopify) return demoProduct(handle);
  try {
    const data = await shopifyFetch<any>(PRODUCT_BY_HANDLE_QUERY, { handle }, ISR);
    if (!data.productByHandle) return null;
    const product = reshapeProduct(data.productByHandle) as Product;
    return availableProducts([product])[0] || null;
  } catch (err) {
    console.error('[shopify] getProduct failed, falling back to demo data:', err);
    const fallback = demoProduct(handle);
    return fallback ? availableProducts([fallback])[0] || null : null;
  }
}

export async function getCollection(handle: string) {
  if (!hasShopify) return availableProducts(demoProducts);
  try {
    const data = await shopifyFetch<any>(COLLECTION_BY_HANDLE_QUERY, { handle, first: 24 }, ISR);
    const products = data.collectionByHandle?.products.edges.map((e: any) => reshapeProduct(e.node)) || [];
    return availableProducts(products);
  } catch (err) {
    console.error('[shopify] getCollection failed, falling back to demo data:', err);
    return availableProducts(demoProducts);
  }
}
