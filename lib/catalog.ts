import type { Product } from '@/types/shopify';
import { hasMisleadingProductMedia } from '@/lib/productReadiness';

export const catalogCategories = ['All', 'Golf Balls', 'Gloves', 'Grips', 'Towels', 'Training Aids', 'Golf Tech', 'Club Care', 'Headwear', 'Apparel', 'Accessories'] as const;

const rules: Array<[Exclude<(typeof catalogCategories)[number], 'All'>, string[]]> = [
  ['Golf Balls', ['golf balls', 'golf ball set', 'prank ball']],
  ['Gloves', ['glove']],
  ['Grips', ['grip', 'overgrip']],
  ['Towels', ['towel']],
  ['Training Aids', ['training aid', 'training aids', 'putting mirror', 'alignment mirror', 'putting gate', 'putting mat', 'alignment stick', 'swing trainer', 'swing tempo', 'tempo trainer', 'chipping net', 'short game', 'range gear']],
  ['Golf Tech', ['golf tech', 'rangefinder', 'laser rangefinder', 'gps speaker', 'golf gps', 'launch monitor', 'phone mount', 'gps watch', 'golf watch']],
  ['Club Care', ['club care', 'club brush', 'brush cleaner', 'groove cleaner', 'groove sharpener', 'wedge tool', 'grip solvent']],
  ['Headwear', ['hat', 'cap', 'headwear']],
  ['Apparel', ['polo', 'shirt', 'hoodie', 'apparel', 'sock', 'socks', 'quarter zip', 'pullover', 'belt']],
  ['Accessories', ['accessory', 'marker', 'divot', 'tee', 'bag', 'tool', 'flask', 'cooler', 'caddie', 'headcover', 'putter', 'retriever', 'pouch', 'organizer', 'shoe bag', 'tumbler', 'rain hood', 'sunglasses', 'arm sleeve']]
];

type ClassifiableProduct = Pick<Product, 'title' | 'productType' | 'vendor' | 'tags'>;

function searchable(product: ClassifiableProduct) {
  return [product.title, product.productType, product.vendor, ...(product.tags || [])].filter(Boolean).join(' ').toLowerCase();
}

const blockedPublicVendors = new Set([
  'GolfbaysUSA'
]);

const weakPublicTerms = /simulator|hitting mat|impact screen|enclosure|display rack|bungee|protective case|foam triangle|pelmet|rubber ball tray/i;

function publicPriceAllowed(product: Product) {
  const prices = product.variants.map((variant) => Number(variant.price.amount)).filter(Number.isFinite);
  const price = prices.length ? Math.min(...prices) : Number(product.priceRange.minVariantPrice.amount);
  const category = categoryFor(product);
  const text = searchable(product);
  if (price <= 0) return false;
  if (category === 'Golf Tech' || /rangefinder|gps|launch monitor/.test(text)) return price <= 350;
  if (category === 'Training Aids' || /training|trainer|putting|alignment|swing|tempo|chipping/.test(text)) return price <= 200;
  if (/golf bag|premium bag|stand bag|cart bag|travel bag/.test(text)) return price <= 400;
  if (category === 'Apparel' || category === 'Headwear') return price <= 150;
  return price <= 150;
}

function passesPublicCatalogGate(product: Product) {
  const text = searchable(product);
  if (product.vendor && blockedPublicVendors.has(product.vendor)) return false;
  if (weakPublicTerms.test(text)) return false;
  return publicPriceAllowed(product);
}

export function categoryFor(product: ClassifiableProduct) {
  const content = searchable(product);
  if (content.includes('ball retriever') || content.includes('ball marker') || content.includes('accessory caddie') || content.includes('divot') || content.includes('headcover')) return 'Accessories';
  return rules.find(([, words]) => words.some((word) => content.includes(word)))?.[0] || 'Accessories';
}

export function matchesCategory(product: ClassifiableProduct, category?: string) {
  return !category || category === 'All' || categoryFor(product).toLowerCase() === category.toLowerCase();
}

export function saleReadyProducts(products: Product[]) {
  return availableProducts(products).filter((product) => product.variants.some((variant) => variant.availableForSale));
}

/** Only show WYX-curated products — blocks old dropship catalog contamination */
function isCuratedProduct(product: Product) {
  const tags = product.tags || [];
  return tags.some((t) => t === 'wyx-curated' || t === 'direct-catalog');
}

export function availableProducts(products: Product[]) {
  return products.filter(
    (product) =>
      product.availableForSale &&
      hasSaleReadyMedia(product) &&
      !hasMisleadingProductMedia(product) &&
      passesPublicCatalogGate(product) &&
      isCuratedProduct(product)
  );
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
