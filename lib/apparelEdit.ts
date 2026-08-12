import type { Product } from '@/types/shopify';

export const apparelEditHandles = [
  'pimento-waffle',
  'hello-friends-t-shirt',
  'looper',
  'legalize-mulligans',
  'volcanic-ash',
  'sahara-sunset',
  'black-birdie',
  'twister-grey',
  'crimson-dune',
  'mossy-condor',
  'bone-dry',
  'sea-swell-blue',
  'gray-eyed-gator',
  'charcoal-mirage',
  'bayou-brown-gator'
] as const;

export const apparelLeadHandles = [
  'pimento-waffle',
  'hello-friends-t-shirt',
  'looper',
  'legalize-mulligans',
  'volcanic-ash',
  'mossy-condor'
] as const;

const topsAndLayersHandles = new Set([
  'pimento-waffle',
  'hello-friends-t-shirt',
  'looper',
  'legalize-mulligans'
]);

const finishingApparelHandles = new Set([
  'volcanic-ash',
  'sahara-sunset',
  'black-birdie',
  'twister-grey',
  'crimson-dune',
  'mossy-condor',
  'bone-dry',
  'sea-swell-blue',
  'gray-eyed-gator',
  'charcoal-mirage',
  'bayou-brown-gator'
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
