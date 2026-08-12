import { apparelEditHandles } from '@/lib/apparelEdit';
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
  'layup-t-shirt',
  'glove-accessory-caddie-gray',
  'blue-ridge-golf-ball-markers-set-of-2',
  'carolina-blue-two-sided-golf-ball-marker-2-pack'
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

const blockedSupplierVendors = ['GolfbaysUSA'];

/** WYX is an opinionated multi-brand golf shop, not an endless supplier catalog. */
export const futureAssortmentHandles = new Set([
  ...apparelEditHandles,
  'classic-leather-edition-walnut-brown-midnight-black',
  'topographic-edition-pure-white-embroidered-carolina-blue',
  'evil-ape',
  'guerrilla-chief-driver-cover',
  'dude-abides-v2-mallet-putter-cover',
  'mafia-mallet-putter-cover',
  'augusta-bear-hat',
  'golf-or-die-game-set',
  'dartee-golf-glove',
  'park-paisley-womens-gold-golf-glove',
  'stick-grips-golf-camo-golf-grip',
  'tri-fold-microfiber-golf-towel',
  'blue-ridge-golf-co-golf-towels',
  'magnet-caddie',
  'glove-accessory-caddie-black',
  'three-rail-ball-marker',
  'two-sided-metal-golf-ball-marker-5-color-combo-pack',
  'bamboo-performance-golf-tees-50-pack'
]);

const homepageBlockedHandles = new Set(['park-paisley-womens-gold-golf-glove']);
const homepageBlockedVendors = new Set(["SHOCK'D Golf Balls"]);

function lowerTags(product: Product) {
  return (product.tags || []).map((tag) => tag.toLowerCase());
}

export function isHiddenFromCoreStorefront(product: Product) {
  const tags = lowerTags(product);
  return hiddenHandles.has(product.handle)
    || tags.includes('wyx-hide')
    || (product.vendor ? blockedSupplierVendors.includes(product.vendor) : false);
}

export function isConfirmedSupplierProduct(product: Product) {
  return product.vendor ? confirmedSupplierVendors.includes(product.vendor) : false;
}

export function isFutureAssortmentProduct(product: Product) {
  const tags = lowerTags(product);
  return futureAssortmentHandles.has(product.handle)
    || tags.includes('wyx-core')
    || tags.includes('wyx-featured');
}

export function isCoreMerchProduct(product: Product) {
  const tags = lowerTags(product);
  if (tags.includes('supplier-review')) return false;
  if (!isFutureAssortmentProduct(product)) return false;
  return !isHiddenFromCoreStorefront(product) && !isPremiumGolfBag(product) && isBuyTodayProduct(product);
}

export function coreMerchProducts(products: Product[]) {
  return products.filter(isCoreMerchProduct);
}

export function isHomepageProduct(product: Product) {
  return isFutureAssortmentProduct(product)
    && !homepageBlockedHandles.has(product.handle)
    && !(product.vendor && homepageBlockedVendors.has(product.vendor))
    && categoryFor(product) !== 'Golf Balls';
}

/** Lead with the best visual/product mix we can actually sell now; basics come later. */
export function firstBuyProducts(products: Product[]) {
  const heroHandles = [
    'pimento-waffle',
    'classic-leather-edition-walnut-brown-midnight-black',
    'topographic-edition-pure-white-embroidered-carolina-blue',
    'augusta-bear-hat',
    'evil-ape',
    'golf-or-die-game-set',
    'dartee-golf-glove',
    'magnet-caddie',
    'dude-abides-v2-mallet-putter-cover',
    'guerrilla-chief-driver-cover',
    'blue-ridge-golf-co-golf-towels',
    'mossy-condor',
    'black-birdie',
    'hello-friends-t-shirt',
    'mafia-mallet-putter-cover',
    'two-sided-metal-golf-ball-marker-5-color-combo-pack',
    'three-rail-ball-marker',
    'glove-accessory-caddie-black',
    'stick-grips-golf-camo-golf-grip',
    'tri-fold-microfiber-golf-towel',
    'bamboo-performance-golf-tees-50-pack'
  ];
  return heroHandles
    .map((handle) => products.find((product) => product.handle === handle))
    .filter((product) => product && isHomepageProduct(product))
    .filter(Boolean) as Product[];
}

export function premiumBagProducts(products: Product[]) {
  const premiumBagVendors = new Set(['Pins and Aces', 'Blue Ridge Golf Co.']);
  return products.filter((product) => product.vendor && premiumBagVendors.has(product.vendor) && !isHiddenFromCoreStorefront(product));
}

export function giftableProducts(products: Product[], limit = 12) {
  return products
    .filter((product) => isFutureAssortmentProduct(product) && Number(productPrice(product).amount) <= 60 && isBuyTodayProduct(product))
    .filter((product) => !isHiddenFromCoreStorefront(product))
    .slice(0, limit);
}

export function bagUpgradeProducts(products: Product[], limit = 12) {
  return products
    .filter((product) => isFutureAssortmentProduct(product) && isBuyTodayProduct(product) && !isHiddenFromCoreStorefront(product) && ['Golf Balls', 'Gloves', 'Grips', 'Towels', 'Accessories', 'Club Care', 'Headwear', 'Apparel', 'Bags'].includes(categoryFor(product)))
    .slice(0, limit);
}

export function tripProducts(products: Product[], limit = 12) {
  return products
    .filter((product) => isFutureAssortmentProduct(product) && isBuyTodayProduct(product) && !isHiddenFromCoreStorefront(product) && /marker|towel|ball|caddie|glove|grip|headcover|hat|cap|shirt|polo|hoodie|belt|game|tee|waffle|bag|duff/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`))
    .slice(0, limit);
}

export function practiceProducts(products: Product[], limit = 12) {
  return products
    .filter((product) => isFutureAssortmentProduct(product) && isBuyTodayProduct(product) && !isHiddenFromCoreStorefront(product))
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
    if (['Towels', 'Accessories', 'Golf Balls', 'Gloves', 'Grips', 'Apparel', 'Headwear', 'Bags'].includes(category)) score += 3;
    if (/marker|towel|glove|grip|ball|caddie|scorecard|alignment|hat|cap|headcover|game|shirt|waffle|belt|bag/i.test(`${product.title} ${(product.tags || []).join(' ')}`)) score += 2;
    return score;
  };
  return products
    .filter((product) => isFutureAssortmentProduct(product) && isBuyTodayProduct(product) && !isHiddenFromCoreStorefront(product))
    .sort((a, b) => dadScore(b) - dadScore(a))
    .slice(0, limit);
}

export function giftUnder25Products(products: Product[], limit = 12) {
  return products
    .filter((product) => isFutureAssortmentProduct(product) && isBuyTodayProduct(product) && !isHiddenFromCoreStorefront(product) && Number(productPrice(product).amount) <= 25)
    .slice(0, limit);
}
