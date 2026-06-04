import { categoryFor } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import type { Product } from '@/types/shopify';

export function isPremiumGolfBag(product: Product) {
  return /golf bag/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`);
}

export function productQualityScore(product: Product) {
  const price = Number(productPrice(product).amount);
  const category = categoryFor(product);
  const title = product.title.toLowerCase();
  let score = 0;

  if (product.availableForSale) score += 5;
  if (product.featuredImage?.url) score += 4;
  if (product.variants.some((variant) => variant.availableForSale)) score += 4;
  if (price <= 60) score += 5;
  if (price <= 35) score += 3;
  if (['Golf Balls', 'Gloves', 'Grips', 'Towels'].includes(category)) score += 4;
  if (category === 'Accessories') score += 3;
  if (/marker|towel|glove|grip|ball|caddie|headcover/i.test(title)) score += 4;
  if (isPremiumGolfBag(product)) score += 3;
  if (price > 250 && !isPremiumGolfBag(product)) score -= 6;

  return score;
}

export function qualityReason(product: Product) {
  const price = Number(productPrice(product).amount);
  const category = categoryFor(product);
  if (isPremiumGolfBag(product)) return 'Premium bag upgrade for the full setup';
  if (price <= 35 && ['Golf Balls', 'Gloves', 'Grips', 'Towels', 'Accessories'].includes(category)) return 'Easy first-cart product golfers actually use';
  if (price <= 60) return 'Giftable under-$60 golf pick';
  return 'Useful golf gear for everyday rounds';
}

export function sortByQuality<T extends Product>(products: T[]) {
  return [...products].sort((a, b) => productQualityScore(b) - productQualityScore(a));
}
