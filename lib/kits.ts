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
// Walks categoryPriority in order, picks the BEST-scored product from each category
// (not seen yet), stops when limit is reached. No category repeats.
export function kitProducts(products: Product[], kit: KitDefinition, limit = 4): Product[] {
  const usedHandles = new Set<string>();
  const usedCategories = new Set<string>();
  const result: Product[] = [];

  // Phase 1: one product per category, in priority order, scored within category
  for (const cat of kit.categoryPriority) {
    if (result.length >= limit) break;
    if (usedCategories.has(cat)) continue;
    const candidates = products.filter(
      (p) => !usedHandles.has(p.handle) && categoryFor(p) === cat
    );
    if (!candidates.length) continue;
    // Sort candidates by slot score descending — picks the best fit, not just first
    candidates.sort((a, b) => kitSlotScore(b, cat) - kitSlotScore(a, cat));
    const pick = candidates[0];
    result.push(pick);
    usedHandles.add(pick.handle);
    usedCategories.add(cat);
  }

  // Phase 2: fill remaining slots with fallback match, never repeating a category
  if (result.length < limit) {
    const usedCats = new Set(result.map((p) => categoryFor(p)));
    const fallbacks = products.filter(
      (p) => !usedHandles.has(p.handle) && !usedCats.has(categoryFor(p)) && kit.fallbackMatch(p)
    );
    for (const p of fallbacks) {
      if (result.length >= limit) break;
      const cat = categoryFor(p);
      if (usedCats.has(cat)) continue;
      result.push(p);
      usedHandles.add(p.handle);
      usedCats.add(cat);
    }
  }

  return result;
}

// Helper: category-aware score to pick the BEST product for a kit slot.
// Returns 0 if the product is ineligible for this kit, higher = better fit.
function kitSlotScore(product: Product, category: string): number {
  const title = product.title.toLowerCase();
  if (category === 'Golf Tech') {
    // Prefer rangefinder over GPS watch for trip kit (lower price, universal)
    if (/rangefinder|laser range/.test(title)) return 10;
    if (/gps watch|golf watch/.test(title)) return 8;
    return 5;
  }
  if (category === 'Accessories') {
    // Prefer practical trip/bag accessories over generic markers
    if (/scorecard holder/.test(title)) return 10;
    if (/shoe (travel |trip )?bag/.test(title)) return 9;
    if (/umbrella/.test(title)) return 8;
    if (/flask/.test(title)) return 7;
    if (/cart organizer|organizer caddie/.test(title)) return 6;
    if (/iron head cover|headcover/.test(title)) return 5;
    if (/marker|divot/.test(title)) return 3; // de-prioritize markers (already have enough)
    return 4;
  }
  if (category === 'Training Aids') {
    if (/chipping net/.test(title)) return 10;
    if (/alignment board|alignment stick/.test(title)) return 9;
    if (/putting (alignment )?mirror/.test(title)) return 8;
    if (/putting cup|putting mat/.test(title)) return 7;
    return 5;
  }
  if (category === 'Golf Balls') {
    if (/night golf|glow|light.?up/.test(title)) return 8; // creative pick
    if (/tour|urethane/.test(title)) return 10;
    return 5;
  }
  return 5;
}

export const kitDefinitions: KitDefinition[] = [
  {
    slug: 'golf-trip-kit',
    title: 'Golf Trip Kit',
    eyebrow: 'Trip Gear',
    description: 'The essential gear for buddy trips and bachelor weekends: fresh gloves for multiple rounds, a carabiner towel, a rangefinder for unfamiliar courses, and a premium ball pack. Everything used before you reach the first tee.',
    cta: 'Add Trip Kit',
    // Trip essentials: gloves (consumable — go through 2-3 on a trip), towel (daily use),
    // Golf Tech (rangefinder or GPS — playing unfamiliar course), Golf Balls (always low),
    // Accessories (shoe bag, flask, umbrella — trip practical), Apparel (socks, UV gaiter)
    categoryPriority: ['Gloves', 'Golf Tech', 'Golf Balls', 'Accessories', 'Towels', 'Training Aids', 'Headwear', 'Apparel'],
    fallbackMatch: (product) => {
      const text = `${product.title} ${product.productType} ${(product.tags || []).join(' ')}`.toLowerCase();
      return /glove|rangefinder|gps watch|golf watch|golf ball|shoe bag|umbrella|towel|hat|cap|sock/i.test(text);
    }
  },
  {
    slug: 'dad-gift-kit',
    title: 'Dad Golf Gift Kit',
    eyebrow: "Father's Day Ready",
    description: "Four gifts Dad uses every single round: a cabretta glove 3-pack, a leather scorecard holder, a quality towel, and a training tool for the next range session. No guessing — these earn a permanent bag spot.",
    cta: 'Add Dad Gift Kit',
    // Dad gift: glove (practical), scorecard holder (elegant leather), towel (gift standard),
    // training aid or tech (something he would not buy himself)
    categoryPriority: ['Gloves', 'Accessories', 'Towels', 'Training Aids', 'Golf Tech', 'Headwear', 'Golf Balls'],
    fallbackMatch: (product) => {
      const price = Number(productPrice(product).amount);
      const text = `${product.title} ${product.productType} ${(product.tags || []).join(' ')}`.toLowerCase();
      return price <= 80 && /glove|scorecard|towel|alignment|putting|training|hat|cap/i.test(text);
    }
  },
  {
    slug: 'bag-upgrade-kit',
    title: 'Bag Upgrade Kit',
    eyebrow: 'Better Bag Build',
    description: 'Four upgrades that make the bag work harder every round: a club brush for clean grooves, a leather scorecard holder, fresh cord grips on the whole set, and alignment sticks for the next range session.',
    cta: 'Add Bag Kit',
    // Bag upgrade = maintenance + organization + practice
    // Club brush (daily maintenance), Scorecard holder (org), Grip regrip kit (performance), Alignment sticks
    categoryPriority: ['Club Care', 'Accessories', 'Grips', 'Training Aids', 'Towels', 'Gloves'],
    fallbackMatch: (product) => {
      const text = `${product.title} ${product.productType} ${(product.tags || []).join(' ')}`.toLowerCase();
      return /brush|groove|scorecard|grip|alignment|putting mirror|towel/i.test(text);
    }
  }
];

// Export slot scorer for use in kit pages if needed
export { kitSlotScore };

export function kitBySlug(slug: string) {
  return kitDefinitions.find((kit) => kit.slug === slug);
}
