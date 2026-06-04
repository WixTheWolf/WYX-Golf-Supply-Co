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
    title: 'The Range Rat Reset Kit',
    eyebrow: 'Range-Ready Accessories',
    description: 'Grip tape, a towel, and a fresh grip for players who want the bag ready before Saturday morning.',
    handles: ['pulse-golf-overgrip-tape', 'blue-ridge-golf-co-golf-towels', 'stick-grips-golf-camo-golf-grip']
  },
  {
    title: 'The Clean Contact Kit',
    eyebrow: 'Club Care Starter',
    description: 'Cleaner clubs. Better contact. Fewer excuses. A simple club-care setup for golfers who want their towel, grooves, and ball marker ready before the first tee.',
    handles: ['blue-ridge-golf-co-golf-towels', 'tri-fold-microfiber-golf-towel', 'pulse-golf-overgrip-tape']
  },
  {
    title: 'The Green-Side Survival Kit',
    eyebrow: 'Short Game Helpers',
    description: 'Markers, glove storage, and small accessories for golfers who want the green-side basics handled.',
    handles: ['pulse-golf-overgrip-tape', 'park-paisley-womens-gold-golf-glove', 'glove-accessory-caddie-gray']
  },
  {
    title: 'The Golf Dad Gift Kit',
    eyebrow: 'Gift-Ready Bundle',
    description: "Useful golf gifts he'll actually keep in the bag. Skip the novelty junk. This kit is built around towels, markers, gloves, and small upgrades that make every round feel a little more dialed.",
    handles: ['three-rail-ball-marker', 'two-sided-metal-golf-ball-marker-5-color-combo-pack', 'glove-accessory-caddie-gray']
  },
  {
    title: 'The Saturday Morning Bag Kit',
    eyebrow: 'Weekend Round Ready',
    description: 'Balls, a glove, and a headcover upgrade for the player trying to get the bag ready before the first tee.',
    handles: ['classic-leather-edition-walnut-brown-midnight-black', 'park-paisley-womens-gold-golf-glove', 'shockd-golf-balls']
  },
  {
    title: 'The Bachelor Party Bag Kit',
    eyebrow: 'Group Gift Builder',
    description: "Small golf gifts for the group that won't get left in the Airbnb. Markers, towels, balls, and bag accessories for tournament weekends, golf trips, and first-tee chaos.",
    handles: ['three-rail-ball-marker', 'two-sided-metal-golf-ball-marker-5-color-combo-pack', 'shockd-golf-balls']
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
