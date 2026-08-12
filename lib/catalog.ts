import type { Product } from '@/types/shopify';
import { hasVerifiedFulfillment } from '@/lib/fulfillmentReadiness';
import { isHiddenFromCoreStorefront } from '@/lib/merchandisingFilters';
import { hasMisleadingProductMedia, hasKnownImageMismatch } from '@/lib/productReadiness';

export const catalogCategories = ['All', 'Apparel', 'Footwear', 'Headwear', 'Bags', 'Golf Tech', 'Accessories', 'Gloves', 'Towels', 'Grips', 'Training Aids', 'Club Care', 'Golf Balls'] as const;

const rules: Array<[Exclude<(typeof catalogCategories)[number], 'All'>, string[]]> = [
  ['Footwear', ['golf shoe', 'golf shoes', 'spikeless', 'spiked shoe', 'footwear']],
  ['Bags', ['golf bag', 'stand bag', 'cart bag', 'carry bag', 'sunday bag', 'travel bag', 'duffle', 'duffel']],
  ['Apparel', ['polo', 'shirt', 'hoodie', 'apparel', 'sock', 'socks', 'short', 'shorts', 'pant', 'pants', 'trouser', 'quarter zip', 'pullover', 'belt', 'waffle layer', 'golf layer']],
  ['Headwear', ['hat', 'cap', 'headwear']],
  ['Gloves', ['glove']],
  ['Golf Tech', ['golf tech', 'rangefinder', 'laser rangefinder', 'gps speaker', 'golf gps', 'launch monitor', 'phone mount', 'gps watch', 'golf watch']],
  ['Accessories', ['accessory', 'marker', 'divot', 'tee', 'tool', 'flask', 'cooler', 'caddie', 'headcover', 'putter cover', 'driver cover', 'retriever', 'ball retriever', 'pouch', 'organizer', 'tumbler', 'rain hood', 'sunglasses', 'arm sleeve', 'cup holder', 'umbrella holder', 'cart mount']],
  ['Towels', ['towel']],
  ['Grips', ['grip', 'overgrip']],
  ['Club Care', ['club care', 'club brush', 'brush cleaner', 'groove cleaner', 'groove sharpener', 'wedge tool', 'grip solvent']],
  ['Training Aids', ['training aid', 'training aids', 'putting mirror', 'alignment mirror', 'putting gate', 'putting mat', 'putting arc', 'alignment stick', 'swing trainer', 'swing tempo', 'tempo trainer', 'chipping net', 'divot board', 'short game', 'range gear', 'impact bag']],
  ['Golf Balls', ['golf balls', 'golf ball set', 'prank ball']]
];

type ClassifiableProduct = Pick<Product, 'title' | 'productType' | 'vendor' | 'tags'>;

const productTypeCategoryMap: Record<string, Exclude<(typeof catalogCategories)[number], 'All'>> = {
  headwear: 'Headwear',
  hats: 'Headwear',
  hat: 'Headwear',
  cap: 'Headwear',
  footwear: 'Footwear',
  'golf shoes': 'Footwear',
  'golf shoe': 'Footwear',
  shoes: 'Footwear',
  'golf bags': 'Bags',
  'golf bag': 'Bags',
  'stand bag': 'Bags',
  'cart bag': 'Bags',
  'travel bag': 'Bags',
  apparel: 'Apparel',
  'golf belt': 'Apparel',
  belt: 'Apparel',
  gloves: 'Gloves',
  glove: 'Gloves',
  grips: 'Grips',
  grip: 'Grips',
  towels: 'Towels',
  towel: 'Towels',
  'training aids': 'Training Aids',
  'training aid': 'Training Aids',
  'golf tech': 'Golf Tech',
  'club care': 'Club Care',
  accessories: 'Accessories',
  accessory: 'Accessories',
  'golf balls': 'Golf Balls',
  'golf ball': 'Golf Balls'
};

function searchable(product: ClassifiableProduct) {
  return [product.title, product.productType, product.vendor, ...(product.tags || [])].filter(Boolean).join(' ').toLowerCase();
}

function tagCategory(product: ClassifiableProduct) {
  const tags = (product.tags || []).map((tag) => tag.toLowerCase());
  const mapped = tags
    .map((tag) => tag.replace(/^wyx-category:/, '').trim().replaceAll('-', ' '))
    .map((tag) => productTypeCategoryMap[tag])
    .find(Boolean);
  return mapped;
}

function typeCategory(product: ClassifiableProduct) {
  const type = product.productType?.trim().toLowerCase();
  if (!type) return undefined;
  return productTypeCategoryMap[type];
}

const blockedPublicVendors = new Set(['GolfbaysUSA']);
const weakPublicTerms = /simulator enclosure|impact screen|display rack|bungee|foam triangle|pelmet|rubber ball tray/i;

function publicPriceAllowed(product: Product) {
  const prices = product.variants.map((variant) => Number(variant.price.amount)).filter(Number.isFinite);
  const price = prices.length ? Math.min(...prices) : Number(product.priceRange.minVariantPrice.amount);
  const category = categoryFor(product);
  const text = searchable(product);
  if (price <= 0) return false;
  if (category === 'Golf Tech' || /rangefinder|gps|launch monitor/.test(text)) return price <= 700;
  if (category === 'Training Aids' || /training|trainer|putting|alignment|swing|tempo|chipping/.test(text)) return price <= 300;
  if (category === 'Bags') return price <= 500;
  if (category === 'Footwear') return price <= 300;
  if (category === 'Apparel' || category === 'Headwear') return price <= 200;
  return price <= 180;
}

function passesPublicCatalogGate(product: Product) {
  const text = searchable(product);
  if (product.vendor && blockedPublicVendors.has(product.vendor)) return false;
  if (weakPublicTerms.test(text)) return false;
  return publicPriceAllowed(product);
}

export function categoryFor(product: ClassifiableProduct) {
  const productTypeLower = product.productType?.trim().toLowerCase();
  if (productTypeLower === 'golf belt' || productTypeLower === 'belt') return 'Apparel';

  const content = searchable(product);

  if (/golf shoes?|spikeless|spiked shoe|footwear/.test(content)) return 'Footwear';
  if (/golf bag|stand bag|cart bag|carry bag|sunday bag|travel bag|duffle|duffel/.test(content)) return 'Bags';
  if (content.includes('pimento waffle')) return 'Apparel';
  if (content.includes('hello friends t-shirt')) return 'Apparel';
  if (content.includes('groove sharpener') || content.includes('club face pick') || content.includes('club maintenance') || content.includes('spike wrench')) return 'Club Care';
  if (content.includes('ball retriever')) return 'Accessories';
  if (content.includes('ball marker') || content.includes('hat clip ball marker')) return 'Accessories';
  if (content.includes('accessory caddie') || content.includes('headcover')) return 'Accessories';
  if (content.includes('divot tool') || (content.includes('divot') && !content.includes('divot board'))) return 'Accessories';
  if (/hat clip/i.test(content) && !/hat|cap|headwear/i.test(content)) return 'Accessories';

  const matched = rules.find(([, words]) => words.some((word) => content.includes(word)));
  if (matched) return matched[0];

  const fromTag = tagCategory(product);
  if (fromTag) return fromTag;

  const fromType = typeCategory(product);
  if (fromType) return fromType;

  return 'Accessories';
}

export function matchesCategory(product: ClassifiableProduct, category?: string) {
  return !category || category === 'All' || categoryFor(product).toLowerCase() === category.toLowerCase();
}

export function saleReadyProducts(products: Product[]) {
  return availableProducts(products).filter((product) => product.variants.some((variant) => variant.availableForSale));
}

function isCuratedProduct(product: Product) {
  if (product.vendor === 'WYX Golf Supply Co.') return true;
  const tags = (product.tags || []).map((t) => t.toLowerCase());
  return tags.some((t) => t === 'wyx-curated' || t === 'direct-catalog');
}

export function availableProducts(products: Product[]) {
  return products.filter((product) => {
    if (!product.availableForSale) return false;
    if (!hasVerifiedFulfillment(product)) return false;
    if (isHiddenFromCoreStorefront(product)) return false;
    if ((product.tags || []).some((tag) => tag.toLowerCase() === 'supplier-review')) return false;
    if (!passesPublicCatalogGate(product)) return false;
    if (hasKnownImageMismatch(product)) return false;
    if (isCuratedProduct(product)) return true;
    return hasSaleReadyMedia(product) && !hasMisleadingProductMedia(product);
  });
}

export function categoryCount(products: Product[], category: string) {
  return products.filter((product) => matchesCategory(product, category)).length;
}

export function supplierName(product: Product) {
  return product.vendor && product.vendor !== 'WYX Golf Supply Co.' ? product.vendor : 'WYX Golf Supply';
}

const placeholderImageNames = [
  'hero-coastal-fairway.png',
  'forest-polo-product.png',
  'golf-towel-product.png',
  'journal-club-care.png',
  'journal-course-strategy.png',
  'journal-iron-practice.png',
  'leather-bag-detail.png',
  'rope-hat-product.png',
  'walking-golfer-lifestyle..png'
];

export function hasSaleReadyMedia(product: Pick<Product, 'featuredImage' | 'images'>) {
  const urls = [product.featuredImage?.url, ...(product.images || []).map((image) => image.url)].filter(Boolean).map((url) => String(url).toLowerCase());
  if (!urls.length) return false;
  return !urls.some((url) => placeholderImageNames.some((name) => url.includes(name)) || url.includes('/images/'));
}
