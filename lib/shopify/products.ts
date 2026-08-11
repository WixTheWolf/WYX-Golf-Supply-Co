import { availableProducts } from '@/lib/catalog';
import { demoProduct, demoProducts } from '@/lib/demo';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
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

/**
 * Public product lookup. A Shopify product can exist and be active while still
 * being withheld from WYX because fulfillment, media, or merchandising gates
 * have not passed. If it is not in the current WYX edit, it does not resolve as
 * a public product page.
 */
export async function getProduct(handle: string) {
  if (!hasShopify) {
    const fallback = demoProduct(handle);
    return fallback ? coreMerchProducts(availableProducts([fallback]))[0] || null : null;
  }
  try {
    const data = await shopifyFetch<any>(PRODUCT_BY_HANDLE_QUERY, { handle }, ISR);
    if (!data.productByHandle) return null;
    const product = reshapeProduct(data.productByHandle) as Product;
    return coreMerchProducts(availableProducts([product]))[0] || null;
  } catch (err) {
    console.error('[shopify] getProduct failed, falling back to demo data:', err);
    const fallback = demoProduct(handle);
    return fallback ? coreMerchProducts(availableProducts([fallback]))[0] || null : null;
  }
}

export async function getCollection(handle: string) {
  if (!hasShopify) return coreMerchProducts(availableProducts(demoProducts));
  try {
    const data = await shopifyFetch<any>(COLLECTION_BY_HANDLE_QUERY, { handle, first: 24 }, ISR);
    const products = data.collectionByHandle?.products.edges.map((e: any) => reshapeProduct(e.node)) || [];
    return coreMerchProducts(availableProducts(products));
  } catch (err) {
    console.error('[shopify] getCollection failed, falling back to demo data:', err);
    return coreMerchProducts(availableProducts(demoProducts));
  }
}
