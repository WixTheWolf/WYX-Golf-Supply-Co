import { categoryFor } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import type { Product } from '@/types/shopify';

export type KitDefinition = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  cta: string;
  // Ordered list of category priorities — picks one product from each, in order
  categoryPriority: string[];
  // Secondary keyword match for fallback if category is empty
  fallbackMatch: (product: Product) => boolean;
};

// Category-diverse kit builder.
// Walks categoryPriority in order, picks the BEST quality product from each category
// (not seen yet), stops when limit is reached. No category repeats.
export function kitProducts(products: Product[], kit: KitDefinition, limit = 4): Product[] {
  const usedHandles = new Set<string>();
  const result: Product[] = [];

  // Phase 1: one product per category, in priority order
  for (const cat of kit.categoryPriority) {
    if (result.length >= limit) break;
    const pick = products.find(
      (p) => !usedHandles.has(p.handle) && categoryFor(p) === cat
    );
    if (pick) {
      result.push(pick);
      usedHandles.add(pick.handle);
    }
  }

  // Phase 2: fill remaining slots with fallback match (different handle)
  if (result.length < limit) {
    const fallbacks = products.filter(
      (p) => !usedHandles.has(p.handle) && kit.fallbackMatch(p)
    );
    for (const p of fallbacks) {
      if (result.length >= limit) break;
      result.push(p);
      usedHandles.add(p.handle);
    }
  }

  return result;
}

export const kitDefinitions: KitDefinition[] = [
  {
    slug: 'golf-trip-kit',
    title: 'Golf Trip Kit',
    eyebrow: 'Trip Gear',
    description: 'The complete gear checklist for buddy trips and bachelor weekends: glove, towel, shoe bag, balls, tees, and a rangefinder or alignment sticks to stay sharp away from home.',
    cta: 'Add Trip Kit',
    // A real trip needs: gloves (consumable on trip), towel (daily use),
    // shoe bag (separates spikes from clothes), golf balls (always running low),
    // tech (rangefinder/GPS — plays a new course?), tees/accessories
    categoryPriority: ['Gloves', 'Towels', 'Accessories', 'Golf Balls', 'Golf Tech', 'Training Aids', 'Headwear', 'Apparel'],
    fallbackMatch: (product) => /glove|towel|shoe bag|golf ball|tee|rangefinder|gps|alignment|hat|cap|polo|sock/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)
  },
  {
    slug: 'dad-gift-kit',
    title: 'Dad Golf Gift Kit',
    eyebrow: "Father's Day Ready",
    description: 'Four useful golf gifts Dad can put straight in the bag: a fresh glove, a clean towel, ball markers he will actually keep, and a practice tool for the next range session.',
    cta: 'Add Dad Gift Kit',
    // Dad gift: glove (practical, personal), towel (gift standard), markers (universal),
    // training aid or tech (something he would not buy himself), hat optional
    categoryPriority: ['Gloves', 'Towels', 'Accessories', 'Training Aids', 'Headwear', 'Golf Tech', 'Golf Balls'],
    fallbackMatch: (product) => Number(productPrice(product).amount) <= 75 && /glove|towel|marker|divot|alignment|putting|hat|cap|ball|tee/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)
  },
  {
    slug: 'bag-upgrade-kit',
    title: 'Bag Upgrade Kit',
    eyebrow: 'Better Bag Build',
    description: 'Four functional upgrades that make every round smoother: a club brush, a scorecard holder, grip tape for a fresh feel, and alignment sticks for the next range session.',
    cta: 'Add Bag Kit',
    // Bag upgrade = maintenance + organisation + practice setup
    // club brush, scorecard holder, grip tape, alignment sticks/putting mirror
    categoryPriority: ['Club Care', 'Accessories', 'Grips', 'Training Aids', 'Towels', 'Gloves'],
    fallbackMatch: (product) => /brush|groove|scorecard|grip tape|alignment|putting mirror|towel|divot/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`)
  }
];

export function kitBySlug(slug: string) {
  return kitDefinitions.find((kit) => kit.slug === slug);
}
