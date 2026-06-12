import { categoryFor } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import { isBuyTodayProduct } from '@/lib/productQuality';
import type { Product } from '@/types/shopify';

export type StoreDepartment =
  | 'Hats'
  | 'Apparel'
  | 'Golf Tech'
  | 'Practice Gear'
  | 'Swing Correction';

export const storeDepartments: Array<{
  id: StoreDepartment;
  title: string;
  copy: string;
  href: string;
}> = [
  {
    id: 'Hats',
    title: 'Hats',
    copy: 'Structured caps and sun coverage built for 18 holes.',
    href: '/golf-hats'
  },
  {
    id: 'Apparel',
    title: 'Apparel',
    copy: 'Belts, layers, and round-ready pieces that wear well beyond the first tee.',
    href: '/golf-apparel'
  },
  {
    id: 'Golf Tech',
    title: 'Golf Tech',
    copy: 'Rangefinders, GPS, and cart tech that remove guesswork from every hole.',
    href: '/golf-tech'
  },
  {
    id: 'Practice Gear',
    title: 'Practice Gear',
    copy: 'Putting mats, chipping nets, and backyard tools for real repetition.',
    href: '/golf-training-aids'
  },
  {
    id: 'Swing Correction',
    title: 'Swing Correction',
    copy: 'Alignment mirrors, divot boards, and tempo trainers for cleaner mechanics.',
    href: '/swing-correction'
  }
];

function haystack(product: Product) {
  return [product.title, product.productType, product.vendor, ...(product.tags || [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function departmentFor(product: Product): StoreDepartment | null {
  const category = categoryFor(product);
  const text = haystack(product);

  if (/hat clip|tee holder|tee dispenser/i.test(text)) return null;
  if (category === 'Headwear') return 'Hats';
  if (category === 'Apparel') return 'Apparel';
  if (category === 'Golf Tech') return 'Golf Tech';

  if (category === 'Training Aids') {
    if (/swing trainer|divot board|alignment mirror|putting mirror|tempo trainer|swing path|impact bag|alignment stick|stance alignment/i.test(text)) {
      return 'Swing Correction';
    }
    return 'Practice Gear';
  }

  if (/rangefinder|gps watch|phone mount|launch monitor/i.test(text)) return 'Golf Tech';
  if (/hat|cap|visor|headwear/i.test(text) && !/belt|marker clip|tee holder|tee dispenser/i.test(text)) return 'Hats';
  if (/polo|hoodie|sock|gaiter|belt|quarter zip|pullover/i.test(text)) return 'Apparel';
  if (/swing trainer|divot board|alignment mirror|tempo/i.test(text)) return 'Swing Correction';
  if (/chipping net|putting mat|putting cup|putting arc|practice/i.test(text)) return 'Practice Gear';

  return null;
}

export function productsForDepartment(products: Product[], department: StoreDepartment, limit = 4) {
  return products
    .filter((product) => isBuyTodayProduct(product))
    .filter((product) => departmentFor(product) === department)
    .sort((a, b) => Number(productPrice(a).amount) - Number(productPrice(b).amount))
    .slice(0, limit);
}

export function departmentProducts(products: Product[], department: StoreDepartment) {
  return products
    .filter((product) => isBuyTodayProduct(product))
    .filter((product) => departmentFor(product) === department);
}