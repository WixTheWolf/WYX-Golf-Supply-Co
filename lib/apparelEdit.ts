import type { Product } from '@/types/shopify';

// Keep the live apparel edit tight until WYX has deeper polos, bottoms and layers.
// A wall of belt colorways makes the store look like a supplier feed, not a retailer.
export const apparelEditHandles = [
  'pimento-waffle',
  'hello-friends-t-shirt',
  'looper',
  'legalize-mulligans',
  'mossy-condor',
  'black-birdie',
  'sea-swell-blue'
] as const;

export const apparelLeadHandles = [
  'pimento-waffle',
  'hello-friends-t-shirt',
  'looper',
  'legalize-mulligans',
  'mossy-condor',
  'black-birdie'
] as const;

const topsAndLayersHandles = new Set([
  'pimento-waffle',
  'hello-friends-t-shirt',
  'looper',
  'legalize-mulligans'
]);

const finishingApparelHandles = new Set([
  'mossy-condor',
  'black-birdie',
  'sea-swell-blue'
]);

function byHandleOrder(products: Product[], handles: readonly string[]) {
  return handles
    .map((handle) => products.find((product) => product.handle === handle))
    .filter(Boolean) as Product[];
}

export function apparelEditProducts(products: Product[]) {
  return byHandleOrder(products, apparelEditHandles);
}

export function apparelLeadProducts(products: Product[], limit = 6) {
  return byHandleOrder(products, apparelLeadHandles).slice(0, limit);
}

export function topsAndLayersProducts(products: Product[]) {
  return products.filter((product) => topsAndLayersHandles.has(product.handle));
}

export function finishingApparelProducts(products: Product[], limit = 8) {
  return apparelEditProducts(products)
    .filter((product) => finishingApparelHandles.has(product.handle))
    .slice(0, limit);
}
