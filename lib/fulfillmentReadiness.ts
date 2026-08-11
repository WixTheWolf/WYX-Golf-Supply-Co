import type { Product } from '@/types/shopify';

/**
 * DSers products are only public after their mapping to the existing Shopify
 * product is recorded as complete in the WYX operating record. Keep this list
 * aligned with data/dsers-spocket-connection.json after each verified mapping.
 */
const VERIFIED_DSERS_HANDLES = new Set([
  'bamboo-performance-golf-tees-50-pack',
  'tri-fold-microfiber-golf-towel'
]);

function tagsFor(product: Pick<Product, 'tags'>) {
  return new Set((product.tags || []).map((tag) => tag.toLowerCase()));
}

export function isDsersProduct(product: Pick<Product, 'tags'>) {
  const tags = tagsFor(product);
  return tags.has('supplier-dsers') || tags.has('fulfillment-aliexpress');
}

export function hasVerifiedFulfillment(product: Pick<Product, 'handle' | 'tags'>) {
  if (!isDsersProduct(product)) return true;
  return VERIFIED_DSERS_HANDLES.has(product.handle);
}

export function fulfillmentBlocker(product: Pick<Product, 'handle' | 'tags'>) {
  return isDsersProduct(product) && !VERIFIED_DSERS_HANDLES.has(product.handle)
    ? 'unverified-dsers-mapping'
    : null;
}

export function verifiedDsersHandles() {
  return [...VERIFIED_DSERS_HANDLES];
}
