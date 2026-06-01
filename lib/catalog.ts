import type { Product } from '@/types/shopify';

export const catalogCategories = ['All', 'Golf Balls', 'Gloves', 'Grips', 'Towels', 'Headwear', 'Apparel', 'Accessories'] as const;

const rules: Array<[Exclude<(typeof catalogCategories)[number], 'All'>, string[]]> = [
  ['Golf Balls', ['ball']],
  ['Gloves', ['glove']],
  ['Grips', ['grip', 'overgrip']],
  ['Towels', ['towel']],
  ['Headwear', ['hat', 'cap', 'headwear']],
  ['Apparel', ['polo', 'shirt', 'hoodie', 'apparel']],
  ['Accessories', ['accessory', 'marker', 'divot', 'tee', 'bag', 'tool', 'flask', 'cooler']]
];

type ClassifiableProduct = Pick<Product, 'title' | 'productType' | 'vendor' | 'tags'>;

function searchable(product: ClassifiableProduct) {
  return [product.title, product.productType, product.vendor, ...(product.tags || [])].filter(Boolean).join(' ').toLowerCase();
}

export function categoryFor(product: ClassifiableProduct) {
  const content = searchable(product);
  return rules.find(([, words]) => words.some((word) => content.includes(word)))?.[0] || 'Accessories';
}

export function matchesCategory(product: ClassifiableProduct, category?: string) {
  return !category || category === 'All' || categoryFor(product).toLowerCase() === category.toLowerCase();
}

export function availableProducts(products: Product[]) {
  return products.filter((product) => product.availableForSale);
}

export function categoryCount(products: Product[], category: string) {
  return products.filter((product) => matchesCategory(product, category)).length;
}

export function supplierName(product: Product) {
  return product.vendor && product.vendor !== 'WYX Golf Supply Co.' ? product.vendor : 'WYX Golf Supply';
}
