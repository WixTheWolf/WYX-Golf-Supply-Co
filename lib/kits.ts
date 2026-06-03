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
    description: 'Grip tape, a real supplier towel, and a fresh grip. Low friction, useful, and built for fast cart adds.',
    handles: ['pulse-golf-overgrip-tape', 'blue-ridge-golf-co-golf-towels', 'stick-grips-golf-camo-golf-grip']
  },
  {
    title: 'Short Game Starter',
    eyebrow: 'Under-$100 Cart Builder',
    description: 'Ball markers and a glove caddie for players who want the green-side basics handled.',
    handles: ['three-rail-ball-marker', 'two-sided-metal-golf-ball-marker-5-color-combo-pack', 'glove-accessory-caddie-gray']
  },
  {
    title: 'Weekend Starter Drop',
    eyebrow: 'Aggressive Upsell',
    description: 'Headcover, glove, and golf balls. Built for shoppers who want personality and utility.',
    handles: ['classic-leather-edition-walnut-brown-midnight-black', 'park-paisley-womens-gold-golf-glove', 'shockd-golf-balls']
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
