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
    description: 'Two grip upgrades and a fresh ball pack. Low friction, useful, and built for fast cart adds.',
    handles: ['pulse-golf-overgrip-tape', 'stick-grips-golf-camo-golf-grip', 'shockd-golf-balls']
  },
  {
    title: 'Short Game Starter',
    eyebrow: 'Under-$100 Cart Builder',
    description: 'A marker, accessory caddie, and balls for players who want the green-side basics handled.',
    handles: ['three-rail-ball-marker', 'glove-accessory-caddie-gray', 'shockd-golf-balls']
  },
  {
    title: 'Weekend Starter Drop',
    eyebrow: 'Aggressive Upsell',
    description: 'A sharp headwear pick plus two small bag upgrades. Built for shoppers who want personality and utility.',
    handles: ['topographic-edition-pure-white-embroidered-carolina-blue', 'three-rail-ball-marker', 'stick-grips-golf-camo-golf-grip']
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
