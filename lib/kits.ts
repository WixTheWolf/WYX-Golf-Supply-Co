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
    title: 'Range Reset Kit',
    eyebrow: 'Best Conversion Play',
    description: 'The fast-moving essentials: grip tape, a towel, and balls. Low friction, useful, and giftable.',
    handles: ['pulse-golf-overgrip-tape', 'hack-daniels-golf-towel', 'shockd-golf-balls']
  },
  {
    title: 'Short Game Starter',
    eyebrow: 'Under-$100 Cart Builder',
    description: 'Glove, balls, and grip tape for players who want an easy bag refresh without overthinking it.',
    handles: ['park-paisley-womens-gold-golf-glove', 'shockd-golf-balls', 'pulse-golf-overgrip-tape']
  },
  {
    title: 'Tournament Bag Prep',
    eyebrow: 'Aggressive Upsell',
    description: 'Premium bag plus towel and golf balls. Built for shoppers ready to spend more.',
    handles: ['player-preferred™-golf-bag-obsidian', 'hack-daniels-golf-towel', 'shockd-golf-balls']
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
