import { categoryFor } from '@/lib/catalog';
import type { Product } from '@/types/shopify';

export type CommerceKit = {
  title: string;
  eyebrow: string;
  description: string;
  handles: string[];
};

export const commerceKits: CommerceKit[] = [
  {
    title: 'Range Grip Reset',
    eyebrow: 'Best Conversion Play',
    description: 'Grip tape, a fresh towel, and a club brush. Low friction, useful, and built for fast cart adds.',
    handles: ['pulse-golf-overgrip-tape', 'tri-fold-microfiber-golf-towel', 'magnetic-golf-club-brush-cleaner']
  },
  {
    title: 'Short Game Starter',
    eyebrow: 'Under-$100 Cart Builder',
    description: 'A putting mirror, groove tool, and marker for players who want the green-side basics handled.',
    handles: ['alignment-putting-mirror', 'groove-sharpener-cleaner-tool', 'three-rail-ball-marker']
  },
  {
    title: 'Weekend Starter Drop',
    eyebrow: 'Aggressive Upsell',
    description: 'Headcover, glove, and tees. Built for shoppers who want personality and utility.',
    handles: ['coastal-green-driver-headcover', 'premium-cabretta-leather-golf-glove', 'bamboo-performance-golf-tees-50-pack']
  }
];

export function kitProducts(products: Product[], handles: string[]) {
  return handles.map((handle) => products.find((product) => product.handle === handle)).filter(Boolean) as Product[];
}

export function kitLines(products: Product[]) {
  return products.map((product) => product.variants.find((variant) => variant.availableForSale)).filter(Boolean).map((variant) => ({ merchandiseId: variant!.id, quantity: 1 }));
}

export function kitCategorySummary(products: Product[]) {
  return Array.from(new Set(products.map((product) => categoryFor(product)))).join(' / ');
}
