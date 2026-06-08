import { categoryFor } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import { isBuyTodayProduct, isPremiumGolfBag } from '@/lib/productQuality';
import type { Product } from '@/types/shopify';

const hiddenHandles = new Set([
  'syb-phone-pouch',
  'white-eagle',
  'josh-kelley-signature-low-taper-fade',
  'gulf-stream-gator',
  'white-braid',
  'legalize-mulligans',
  'layup-t-shirt',
  'looper',
  'dude-abides-golf-towel',
  'zona-towel',
  'hack-daniels-golf-towel',
  'tri-fold-microfiber-golf-towel',
  'waffle-golf-towel',
  'coastal-rope-hat',
  'forest-performance-polo'
]);

const confirmedSupplierVendors = [
  'Blue Ridge Golf Co.',
  'Dartee Golf',
  'Golf or Die',
  'Guerrilla Golf',
  'Pins and Aces',
  'Stick Grips',
  'VukGripz',
  'VivanTee Golf',
  'OnPointGolf.us',
  "SHOCK'D Golf Balls"
];

const blockedSupplierVendors = [
  'GolfbaysUSA'
];

const homepageBlockedHandles = new Set([
  'park-paisley-womens-gold-golf-glove'
]);

const homepageBlockedVendors = new Set([
  "SHOCK'D Golf Balls"
]);

export function isHiddenFromCoreStorefront(product: Product) {
  return hiddenHandles.has(product.handle) || (product.vendor ? blockedSupplierVendors.includes(product.vendor) : false);
}

export function isConfirmedSupplierProduct(product: Product) {
  return product.vendor ? confirmedSupplierVendors.includes(product.vendor) : false;
}

export function isCoreMerchProduct(product: Product) {
  return !isHiddenFromCoreStorefront(product) && !isPremiumGolfBag(product) && isConfirmedSupplierProduct(product) && isBuyTodayProduct(product);
}

export function coreMerchProducts(products: Product[]) {
  return products.filter(isCoreMerchProduct);
}

export function isHomepageProduct(product: Product) {
  return !homepageBlockedHandles.has(product.handle)
    && !(product.vendor && homepageBlockedVendors.has(product.vendor))
    && categoryFor(product) !== 'Golf Balls';
}

export function firstBuyProducts(products: Product[]) {
  const heroHandles = [
    'dartee-golf-glove',
    'augusta-bear-hat',
    'pimento-drip-blade',
    'the-bolt-ball-marker',
    'got-em-ball-marker-limited-edition',
    'three-rail-ball-marker',
    'blue-ridge-golf-co-golf-towels',
    'desert-storm-tan',
    'stretch-golf-belt-supplier-review',
    'glove-accessory-caddie-gray',
    'magnet-caddie',
    'golf-or-die-game-set'
  ];
  return heroHandles
    .map((handle) => products.find((product) => product.handle === handle))
    .filter((product) => product && isHomepageProduct(product))
    .filter(Boolean) as Product[];
}

export function premiumBagProducts(products: Product[]) {
  const premiumBagVendors = new Set([
    'Pins and Aces',
    'Blue Ridge Golf Co.'
  ]);
  return products.filter((product) => product.vendor && premiumBagVendors.has(product.vendor) && !isHiddenFromCoreStorefront(product));
}

export function giftableProducts(products: Product[], limit = 12) {
  return products
    .filter((product) => Number(productPrice(product).amount) <= 60 && isBuyTodayProduct(product))
    .slice(0, limit);
}

export function bagUpgradeProducts(products: Product[], limit = 12) {
  return products
    .filter((product) => isBuyTodayProduct(product) && ['Golf Balls', 'Gloves', 'Grips', 'Towels', 'Accessories', 'Club Care', 'Headwear', 'Apparel'].includes(categoryFor(product)))
    .slice(0, limit);
}

export function tripProducts(products: Product[], limit = 12) {
  return products
    .filter((product) => isBuyTodayProduct(product) && /marker|towel|ball|caddie|glove|grip|headcover|hat|cap|shirt|polo|hoodie|belt/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`))
    .slice(0, limit);
}
