import { categoryFor } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import type { Product } from '@/types/shopify';

const dailyUseCategories = ['Golf Balls', 'Gloves', 'Grips', 'Towels', 'Club Care', 'Accessories'];
const firstCartTerms = /marker|towel|glove|grip|ball|tee|divot|brush|groove|caddie|headcover|hat|game/i;
const weakBuyTerms = /shirt|polo|hoodie|poster|sticker|decal|novelty/i;

export function isPremiumGolfBag(product: Product) {
  return /golf bag/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`);
}

export function isBuyTodayProduct(product: Product) {
  const price = Number(productPrice(product).amount);
  const category = categoryFor(product);
  const haystack = `${product.title} ${product.productType} ${(product.tags || []).join(' ')}`;
  const hasAvailableVariant = product.variants.some((variant) => variant.availableForSale);
  const hasRealMedia = Boolean(product.featuredImage?.url || product.images[0]?.url);
  const isAffordable = price > 0 && price <= 75;
  const isPracticalGolfItem = dailyUseCategories.includes(category) || firstCartTerms.test(haystack);
  const isWeakNoveltyItem = weakBuyTerms.test(haystack) && !/hat|cap|headcover|game/i.test(haystack);

  if (!product.availableForSale || !hasAvailableVariant || !hasRealMedia) return false;
  if (isPremiumGolfBag(product)) return price <= 250;
  return isAffordable && isPracticalGolfItem && !isWeakNoveltyItem;
}

export function productQualityScore(product: Product) {
  const price = Number(productPrice(product).amount);
  const category = categoryFor(product);
  const title = product.title.toLowerCase();
  let score = 0;

  if (isBuyTodayProduct(product)) score += 10;
  if (product.availableForSale) score += 5;
  if (product.featuredImage?.url) score += 4;
  if (product.variants.some((variant) => variant.availableForSale)) score += 4;
  if (price > 0 && price <= 60) score += 7;
  if (price > 0 && price <= 35) score += 4;
  if (dailyUseCategories.includes(category)) score += 5;
  if (category === 'Headwear') score += 1;
  if (/marker|towel|glove|grip|ball|tee|divot|brush|groove|caddie/i.test(title)) score += 6;
  if (/gift|trip|scramble|bundle|set/i.test(title)) score += 3;
  if (isPremiumGolfBag(product)) score += 2;
  if (['Headwear', 'Apparel'].includes(category) && !/hat|cap|headcover/i.test(title)) score -= 4;
  if (price > 75 && !isPremiumGolfBag(product)) score -= 5;
  if (price > 250) score -= 10;

  return score;
}

export function qualityReason(product: Product) {
  const price = Number(productPrice(product).amount);
  const category = categoryFor(product);
  const title = product.title.toLowerCase();
  if (isPremiumGolfBag(product)) return 'Only here if it feels like a real full-bag upgrade.';
  if (/towel|brush|groove|clean/i.test(title)) return 'Solves the dirty-club problem every golfer has.';
  if (/marker|divot|tee/i.test(title)) return 'Small, useful, giftable, and easy to keep in the bag.';
  if (/glove|grip/i.test(title)) return 'A practical feel upgrade golfers notice right away.';
  if (/ball|bundle/i.test(title)) return 'Easy restock for the next round, trip, or prize table.';
  if (/hat|headcover|putter cover|game/i.test(title)) return 'Personality-driven gift with enough golf utility to justify the cart.';
  if (price <= 35 && dailyUseCategories.includes(category)) return 'Low-friction add-on golfers actually use.';
  if (price <= 60) return 'Giftable under-$60 golf pick with a clear use case.';
  return 'Useful golf gear selected for real rounds, not filler.';
}

export function sortByQuality<T extends Product>(products: T[]) {
  return [...products].sort((a, b) => productQualityScore(b) - productQualityScore(a));
}
