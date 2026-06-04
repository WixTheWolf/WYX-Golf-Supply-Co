import { categoryFor } from '@/lib/catalog';
import type { Product } from '@/types/shopify';

export type CommerceKit = {
  title: string;
  eyebrow: string;
  description: string;
  handles: string[];
  complete: boolean;
};

export const commerceKits: CommerceKit[] = [
  {
    title: 'The Golf Trip Survival Kit',
    eyebrow: 'Trip Weekend Builder',
    description: "Everything you forgot to pack before pretending you're a tour pro for three days. Start with towels, markers, balls, caddies, and small bag upgrades.",
    handles: ['buy-3-get-1-free-bundle-shockd-golf-balls', 'dartee-golf-glove', 'blue-ridge-golf-co-golf-towels', 'glove-accessory-caddie-gray'],
    complete: false
  },
  {
    title: 'The Dad Golf Gift Kit',
    eyebrow: 'Dad Gift Builder',
    description: "Useful golf gifts he'll actually put in the bag, not politely toss in a drawer. Towels, markers, balls, gloves, and grip help beat novelty clutter.",
    handles: ['augusta-bear-hat', 'dartee-golf-glove', 'three-rail-ball-marker', 'pulse-golf-overgrip-tape'],
    complete: false
  },
  {
    title: 'The Clean Contact Kit',
    eyebrow: 'Coming Soon / Build Your Own',
    description: 'Cleaner grooves. Better contact. Fewer excuses. The complete kit needs a confirmed brush or groove cleaner, so start with the available towels and add care tools once sourced.',
    handles: ['blue-ridge-golf-co-golf-towels', 'tri-fold-microfiber-golf-towel'],
    complete: false
  },
  {
    title: 'The First Tee Chaos Kit',
    eyebrow: 'Late-To-The-Tee Builder',
    description: 'For the guy who arrives five minutes late, asks for a breakfast ball, and still thinks today is the day. Balls, marker, towel, and caddie basics.',
    handles: ['golf-or-die-game-set', 'shockd-golf-balls-patriot-edition', 'the-bolt-ball-marker', 'magnet-caddie'],
    complete: false
  },
  {
    title: 'The Prize Table Pack',
    eyebrow: 'Scramble Prize Builder',
    description: 'Easy golf prizes people will actually want after the scramble. Markers, towels, balls, gloves, and accessories under $50.',
    handles: ['got-em-ball-marker-limited-edition', 'blue-ridge-golf-ball-markers-set-of-2', 'shockd-golf-balls', 'glove-accessory-caddie-black'],
    complete: false
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
