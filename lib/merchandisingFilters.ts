import { categoryFor } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import { isBuyTodayProduct, isPremiumGolfBag } from '@/lib/productQuality';
import type { Product } from '@/types/shopify';

// Minimal blocklist — only products with confirmed quality or rights issues.
// Towels, hats, and polos removed so they can surface again once images are confirmed.
const hiddenHandles = new Set([
  'syb-phone-pouch',
  'white-eagle',
  'josh-kelley-signature-low-taper-fade',
  'gulf-stream-gator',
  'white-braid',
  'legalize-mulligans',
  'layup-t-shirt',
  'looper'
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
  // Open catalog: any product that passes quality + availability gates shows.
  // Confirmed suppliers get bonus rank in sortByQuality but are no longer required.
  const tags = product.tags || [];
  if (tags.includes('supplier-review')) return false;
  return !isHiddenFromCoreStorefront(product) && !isPremiumGolfBag(product) && isBuyTodayProduct(product);
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
    // Gloves & grip
    'dartee-golf-glove',
    'park-paisley-womens-gold-golf-glove',
    // Hats
    'augusta-bear-hat',
    'stretch-performance-golf-hat-low-crown',
    'wide-brim-golf-sun-hat-upf50',
    'classic-rope-golf-hat-coastal',
    'unstructured-dad-golf-cap-soft-crown',
    'performance-snapback-golf-hat-clean-mark',
    // Markers & accessories
    'pimento-drip-blade',
    'the-bolt-ball-marker',
    'got-em-ball-marker-limited-edition',
    'three-rail-ball-marker',
    'magnet-caddie',
    'glove-accessory-caddie-gray',
    // Towels
    'blue-ridge-golf-co-golf-towels',
    'dude-abides-golf-towel',
    'zona-towel',
    'hack-daniels-golf-towel',
    'tri-fold-microfiber-golf-towel',
    'waffle-golf-towel',
    'magnetic-cart-phone-mount',
    'divot-board-swing-trainer',
    'pop-up-chipping-net-3-target',
    'stance-alignment-towel',
    'extendable-ball-retriever-15ft',
    // Apparel
    'stretch-golf-belt-supplier-review',
    'coastal-rope-hat',
    'forest-performance-polo',
    // Games & gifts
    'golf-or-die-game-set',
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

export function practiceProducts(products: Product[], limit = 12) {
  return products
    .filter((product) => isBuyTodayProduct(product))
    .filter((product) => ['Training Aids'].includes(categoryFor(product)) || /alignment|putting mirror|swing trainer|tempo|practice|range gear/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`))
    .slice(0, limit);
}

export function dadGiftProducts(products: Product[], limit = 12) {
  const dadScore = (product: Product): number => {
    const price = Number(productPrice(product).amount);
    const category = categoryFor(product);
    let score = 0;
    if (price <= 60) score += 4;
    if (price <= 35) score += 3;
    if (['Towels', 'Accessories', 'Golf Balls', 'Gloves', 'Grips'].includes(category)) score += 3;
    if (/marker|towel|glove|grip|ball|caddie|scorecard|alignment|hat|cap/i.test(`${product.title} ${(product.tags || []).join(' ')}`)) score += 2;
    return score;
  };
  return products
    .filter((product) => isBuyTodayProduct(product))
    .sort((a, b) => dadScore(b) - dadScore(a))
    .slice(0, limit);
}

export function giftUnder25Products(products: Product[], limit = 12) {
  return products
    .filter((product) => isBuyTodayProduct(product) && Number(productPrice(product).amount) <= 25)
    .slice(0, limit);
}
