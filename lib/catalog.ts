import type { Product } from '@/types/shopify';
import { hasMisleadingProductMedia } from '@/lib/productReadiness';

export const catalogCategories = ['All', 'Golf Balls', 'Gloves', 'Grips', 'Towels', 'Training Aids', 'Club Care', 'Headwear', 'Apparel', 'Accessories'] as const;

const rules: Array<[Exclude<(typeof catalogCategories)[number], 'All'>, string[]]> = [
  ['Golf Balls', ['golf balls', 'golf ball set', 'prank ball']],
  ['Gloves', ['glove']],
  ['Grips', ['grip', 'overgrip']],
  ['Towels', ['towel']],
  ['Training Aids', ['training aid', 'putting mirror', 'alignment mirror']],
  ['Club Care', ['club care', 'club brush', 'brush cleaner', 'groove cleaner', 'groove sharpener']],
  ['Headwear', ['hat', 'cap', 'headwear']],
  ['Apparel', ['polo', 'shirt', 'hoodie', 'apparel']],
  ['Accessories', ['accessory', 'marker', 'divot', 'tee', 'bag', 'tool', 'flask', 'cooler', 'caddie', 'headcover', 'putter', 'retriever']]
];

type ClassifiableProduct = Pick<Product, 'title' | 'productType' | 'vendor' | 'tags'>;

function searchable(product: ClassifiableProduct) {
  return [product.title, product.productType, product.vendor, ...(product.tags || [])].filter(Boolean).join(' ').toLowerCase();
}

export function categoryFor(product: ClassifiableProduct) {
  const content = searchable(product);
  if (content.includes('ball retriever') || content.includes('ball marker') || content.includes('accessory caddie') || content.includes('divot') || content.includes('headcover')) return 'Accessories';
  return rules.find(([, words]) => words.some((word) => content.includes(word)))?.[0] || 'Accessories';
}

export function matchesCategory(product: ClassifiableProduct, category?: string) {
  return !category || category === 'All' || categoryFor(product).toLowerCase() === category.toLowerCase();
}

export function availableProducts(products: Product[]) {
  return products.filter((product) => product.availableForSale && hasSaleReadyMedia(product) && !hasMisleadingProductMedia(product));
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
