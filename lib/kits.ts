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
    title: 'Weekend Warrior Kit',
    eyebrow: 'Best First Cart',
    description: 'Grip tape, a towel, and a fresh grip for players who want the bag ready before Saturday morning.',
    handles: ['pulse-golf-overgrip-tape', 'blue-ridge-golf-co-golf-towels', 'stick-grips-golf-camo-golf-grip']
  },
  {
    title: 'Clean Contact Kit',
    eyebrow: 'Club Care Starter',
    description: 'A simple bag reset built around cleaner clubs, cleaner towels, and better pre-shot habits.',
    handles: ['blue-ridge-golf-co-golf-towels', 'tri-fold-microfiber-golf-towel', 'pulse-golf-overgrip-tape']
  },
  {
    title: 'Range Rat Kit',
    eyebrow: 'Practice Session Add-On',
    description: 'Grip tape, a glove, and useful accessories for players who live at the range after work.',
    handles: ['pulse-golf-overgrip-tape', 'park-paisley-womens-gold-golf-glove', 'glove-accessory-caddie-gray']
  },
  {
    title: 'Golf Dad Gift Kit',
    eyebrow: 'Gift-Ready Bundle',
    description: 'Small useful pieces Dad can put straight into the bag: markers, towel utility, and glove storage.',
    handles: ['three-rail-ball-marker', 'two-sided-metal-golf-ball-marker-5-color-combo-pack', 'glove-accessory-caddie-gray']
  },
  {
    title: '12-Handicap Survival Kit',
    eyebrow: 'Real Round Rescue',
    description: 'Balls, a glove, and a headcover upgrade for the player trying to keep doubles off the card.',
    handles: ['classic-leather-edition-walnut-brown-midnight-black', 'park-paisley-womens-gold-golf-glove', 'shockd-golf-balls']
  },
  {
    title: 'Bachelor Party Bag',
    eyebrow: 'Group Gift Builder',
    description: 'Easy prize-table products and useful small gear for golf trips, scrambles, and weekend groups.',
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
