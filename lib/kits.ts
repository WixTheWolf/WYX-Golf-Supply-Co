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
    description: 'Grip tape, a fresh towel, and a ball pack. Low friction, useful, and built for fast cart adds.',
    handles: ['pulse-golf-overgrip-tape', 'blue-ridge-golf-co-golf-towels', 'shockd-golf-balls']
  },
  {
    title: 'Short Game Starter',
    eyebrow: 'Under-$100 Cart Builder',
    description: 'A premium marker pack, accessory caddie, and balls for players who want the green-side basics handled.',
    handles: ['two-sided-metal-golf-ball-marker-5-color-combo-pack', 'glove-accessory-caddie-gray', 'shockd-golf-balls']
  },
  {
    title: 'Weekend Starter Drop',
    eyebrow: 'Aggressive Upsell',
    description: 'Headcover, towel, and grip upgrade. Built for shoppers who want personality and utility.',
    handles: ['classic-leather-edition-walnut-brown-midnight-black', 'blue-ridge-golf-co-golf-towels', 'stick-grips-golf-camo-golf-grip']
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
