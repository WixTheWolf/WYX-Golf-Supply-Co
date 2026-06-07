import { categoryFor } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import type { Product } from '@/types/shopify';

export type KitDefinition = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  cta: string;
  match: (product: Product) => boolean;
};

export const kitDefinitions: KitDefinition[] = [
  {
    slug: 'dad-gift-kit',
    title: 'Dad Golf Gift Kit',
    eyebrow: 'Easy Gift Bundle',
    description: 'Start with useful golf gear Dad can put straight in the bag: towels, gloves, balls, markers, hats, and small accessories.',
    cta: 'Add Dad Gift Kit',
    match: (product) => Number(productPrice(product).amount) <= 60 && /towel|marker|glove|grip|ball|hat|cap|caddie/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)
  },
  {
    slug: 'golf-trip-kit',
    title: 'Golf Trip Kit',
    eyebrow: 'Trip Gear',
    description: 'Packable gear for buddy trips, bachelor weekends, scrambles, and the first tee when nobody remembered everything.',
    cta: 'Add Trip Kit',
    match: (product) => /marker|towel|ball|caddie|glove|grip|headcover|hat|cap|shirt|polo|hoodie|belt/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)
  },
  {
    slug: 'bag-upgrade-kit',
    title: 'Bag Upgrade Kit',
    eyebrow: 'Better Bag Build',
    description: 'Small upgrades that make a golf bag cleaner, easier, and more ready for the next round.',
    cta: 'Add Bag Kit',
    match: (product) => ['Golf Balls', 'Gloves', 'Grips', 'Towels', 'Accessories', 'Club Care', 'Headwear'].includes(categoryFor(product))
  }
];

export function kitBySlug(slug: string) {
  return kitDefinitions.find((kit) => kit.slug === slug);
}

export function kitProducts(products: Product[], kit: KitDefinition, limit = 4) {
  return products
    .filter(kit.match)
    .sort((a, b) => Number(productPrice(a).amount) - Number(productPrice(b).amount))
    .slice(0, limit);
}
