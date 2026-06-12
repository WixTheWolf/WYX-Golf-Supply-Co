import { availableProducts, categoryFor } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import { hasKnownImageMismatch, hasMisleadingProductMedia } from '@/lib/productReadiness';
import { isBuyTodayProduct, isPremiumGolfBag, productQualityScore } from '@/lib/productQuality';
import type { Product } from '@/types/shopify';

/**
 * The Bag Test Score: a 0-100 merchandising score used to decide where a
 * product can appear. Built on top of `productQualityScore` (which has an
 * unbounded range) plus catalog-gate and media-quality signals that
 * `productQualityScore` does not consider.
 *
 * Thresholds (per docs/product-integrity-audit.md):
 *   85-100 -> homepage-eligible
 *   70-84  -> collection pages only
 *   50-69  -> hidden until improved (needs real fix: photo, copy, inventory)
 *   <50    -> hidden completely
 */
export function bagTestScore(product: Product): number {
  // productQualityScore ranges roughly from -15 to ~38 in practice.
  // Normalize that range to 0-70, then layer pass/fail gates on top.
  const raw = productQualityScore(product);
  let score = Math.round(((raw + 15) / (38 + 15)) * 70);
  score = Math.max(0, Math.min(70, score));

  if (!product.availableForSale) return Math.min(score, 20);
  if (!product.variants.some((variant) => variant.availableForSale)) return Math.min(score, 20);

  if (hasKnownImageMismatch(product)) return Math.min(score, 30);
  if (hasMisleadingProductMedia(product)) score -= 15;

  if (isBuyTodayProduct(product)) score += 20;
  if (product.featuredImage?.url) score += 5;
  if (isPremiumGolfBag(product)) score -= 10;

  return Math.max(0, Math.min(100, score));
}

export type PlacementTier = 'homepage' | 'collection-only' | 'hidden-needs-improvement' | 'hidden';

export function placementTier(score: number): PlacementTier {
  if (score >= 85) return 'homepage';
  if (score >= 70) return 'collection-only';
  if (score >= 50) return 'hidden-needs-improvement';
  return 'hidden';
}

/**
 * Merchandising tag taxonomy. These are descriptive labels derived from
 * product attributes — intended to be applied as Shopify tags (Phase 12)
 * so collection/search filtering and future automation can rely on them
 * without recomputing scores.
 */
export function merchandisingTags(product: Product): string[] {
  const tags = new Set<string>();
  const price = Number(productPrice(product).amount);
  const category = categoryFor(product);
  const haystack = `${product.title} ${product.productType} ${(product.tags || []).join(' ')}`.toLowerCase();
  const score = bagTestScore(product);
  const tier = placementTier(score);

  if (tier === 'homepage') tags.add('bag-test-approved');
  if (tier === 'hidden-needs-improvement') tags.add('needs-review');
  if (tier === 'hidden') tags.add('hide-from-featured');

  if (isPremiumGolfBag(product)) tags.add('premium');

  if (price > 0 && price <= 60 && isBuyTodayProduct(product)) tags.add('giftable');
  if (price > 0 && price <= 60) tags.add('under-60');

  if (/marker|towel|glove|grip|ball|tee|divot|brush|groove|caddie|headcover|hat|cap|belt/.test(haystack) && price <= 75) {
    tags.add('dad-gift');
    tags.add('trip-gear');
  }

  if (/marker|ball|game|prize|bundle/.test(haystack) && price <= 50) tags.add('scramble-prize');

  if (['Golf Balls', 'Gloves', 'Grips', 'Towels', 'Accessories', 'Club Care', 'Headwear', 'Apparel'].includes(category) && isBuyTodayProduct(product)) {
    tags.add('bag-upgrade');
  }

  if (isBuyTodayProduct(product) && tier !== 'hidden' && tier !== 'hidden-needs-improvement' && price <= 35) {
    tags.add('kit-eligible');
  }

  return Array.from(tags);
}

export type ScoredProduct = {
  handle: string;
  title: string;
  score: number;
  tier: PlacementTier;
  tags: string[];
};

export function scoreCatalog(products: Product[]): ScoredProduct[] {
  return products
    .filter((product) => product.availableForSale)
    .map((product) => ({
      handle: product.handle,
      title: product.title,
      score: bagTestScore(product),
      tier: placementTier(bagTestScore(product)),
      tags: merchandisingTags(product)
    }))
    .sort((a, b) => b.score - a.score);
}

/** Convenience: products that should appear on the homepage per the score thresholds. */
export function homepageEligible(products: Product[]): Product[] {
  return availableProducts(products).filter((product) => placementTier(bagTestScore(product)) === 'homepage');
}
