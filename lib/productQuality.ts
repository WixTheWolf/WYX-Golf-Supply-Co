import { categoryFor } from '@/lib/catalog';
import { productPrice } from '@/lib/feed';
import type { Product } from '@/types/shopify';

const dailyUseCategories = ['Golf Balls', 'Gloves', 'Grips', 'Towels', 'Training Aids', 'Golf Tech', 'Club Care', 'Accessories', 'Headwear', 'Apparel'];
const firstCartTerms = /marker|towel|glove|grip|ball|tee|divot|brush|groove|caddie|headcover|hat|cap|shirt|t-shirt|tee shirt|polo|hoodie|belt|apparel|waffle|layer|pullover|quarter zip|game|training|trainer|putting|alignment|rangefinder|gps|range gear|swing|tempo|chipping/i;
const apparelTerms = /hat|cap|shirt|t-shirt|tee shirt|polo|hoodie|belt|apparel|waffle|layer|pullover|quarter zip|outerwear/i;
const weakBuyTerms = /poster|sticker|decal|novelty|simulator|hitting mat|impact screen|enclosure|display rack|bungee|protective case/i;

export function isPremiumGolfBag(product: Product) {
  return /golf bag/i.test(`${product.title} ${product.productType} ${(product.tags || []).join(' ')}`);
}

export function isBuyTodayProduct(product: Product) {
  const price = Number(productPrice(product).amount);
  const category = categoryFor(product);
  const haystack = `${product.title} ${product.productType} ${(product.tags || []).join(' ')}`;
  const hasAvailableVariant = product.variants.some((variant) => variant.availableForSale);
  const hasRealMedia = Boolean(product.featuredImage?.url || product.images[0]?.url);
  const isGameImprovement = category === 'Training Aids' || category === 'Golf Tech' || /training|trainer|putting|alignment|rangefinder|gps|range gear|swing|tempo|chipping/i.test(haystack);
  const isApparel = category === 'Headwear' || category === 'Apparel' || apparelTerms.test(haystack);
  const isAffordable = price > 0 && (
    price <= 120
    || (isApparel && price <= 175)
    || (isGameImprovement && price <= 250)
    || (/golf bag|stand bag|cart bag|travel bag/i.test(haystack) && price <= 400)
  );
  const isPracticalGolfItem = dailyUseCategories.includes(category) || firstCartTerms.test(haystack) || isApparel;
  const isWeakNoveltyItem = weakBuyTerms.test(haystack) && !/hat|cap|headcover|game/i.test(haystack);

  if (!product.availableForSale || !hasAvailableVariant || !hasRealMedia) return false;
  if (isPremiumGolfBag(product)) return price <= 250;
  return isAffordable && isPracticalGolfItem && !isWeakNoveltyItem;
}

export function productQualityScore(product: Product) {
  const price = Number(productPrice(product).amount);
  const category = categoryFor(product);
  const text = `${product.title} ${product.productType} ${(product.tags || []).join(' ')}`.toLowerCase();
  const isApparel = category === 'Apparel';
  const isHeadwear = category === 'Headwear';
  let score = 0;

  if (isBuyTodayProduct(product)) score += 10;
  if (product.availableForSale) score += 5;
  if (product.featuredImage?.url) score += 4;
  if (product.images.length >= 3) score += 3;
  if (product.variants.some((variant) => variant.availableForSale)) score += 4;

  // WYX is apparel-led. Price should not make a $99 statement piece rank below a $9 add-on.
  if (isApparel) {
    score += 12;
    if (price >= 45 && price <= 125) score += 6;
    if (/shirt|t-shirt|tee shirt|polo|hoodie|waffle|layer|pullover|quarter zip|outerwear/i.test(text)) score += 7;
    if (/belt/i.test(text)) score += 3;
  } else {
    if (price > 0 && price <= 60) score += 6;
    if (price > 0 && price <= 35) score += 3;
  }

  if (isHeadwear) score += 10;
  if (dailyUseCategories.includes(category)) score += 4;
  if (/marker|towel|glove|grip|ball|tee|divot|brush|groove|caddie|headcover|putter cover|driver cover/i.test(text)) score += 5;
  if (/training|trainer|putting|alignment|rangefinder|gps|range gear|swing|tempo|chipping/i.test(text)) score += 4;
  if (/hat|cap/i.test(text)) score += 5;
  if (/gift|trip|scramble|bundle|set|game/i.test(text)) score += 3;
  if (isPremiumGolfBag(product)) score += 2;

  // Premium apparel is expected; only penalize unusually expensive non-apparel commodity items.
  if (price > 85 && !isPremiumGolfBag(product) && !isApparel && !isHeadwear) score -= 5;
  if (price > 250) score -= 10;

  return score;
}

export function qualityReason(product: Product) {
  const price = Number(productPrice(product).amount);
  const category = categoryFor(product);
  const text = `${product.title} ${product.productType} ${(product.tags || []).join(' ')}`.toLowerCase();

  if (isPremiumGolfBag(product)) return 'A larger bag upgrade for golfers ready to replace or reorganize the full setup.';
  if (/shirt|t-shirt|tee shirt|polo|hoodie|waffle|layer|pullover|quarter zip|outerwear/i.test(text)) return 'A golf-lifestyle piece selected to work on the course and still look intentional after the round.';
  if (/belt/i.test(text) || category === 'Apparel') return 'A finishing piece that gives the golf wardrobe more personality without turning it into a costume.';
  if (/headcover|putter cover|driver cover|fairway cover|mallet cover|blade cover/i.test(text)) return 'A bag-personality upgrade with a simple job: protect the club and make the setup yours.';
  if (/caddie|organizer|organiser/i.test(text)) return 'A clean way to keep gloves and small bag gear organized instead of buried in a pocket.';
  if (/towel/.test(text)) return 'A practical bag staple for clubs, golf balls, grips, and wet rounds.';
  if (/brush|groove|clean/i.test(text)) return 'Compact club-care gear for keeping equipment cleaner between shots and rounds.';
  if (/marker|divot|tee/i.test(text)) return 'Small, useful golf gear that is easy to carry, restock, or give.';
  if (/glove/.test(text)) return 'A practical golf essential; confirm hand and size before ordering.';
  if (/grip/.test(text)) return 'A straightforward grip-related upgrade; check compatibility and product options first.';
  if (/ball|bundle/i.test(text)) return 'A simple restock or gift option for the next round, trip, or prize table.';
  if (/hat|cap/i.test(text) || category === 'Headwear') return 'Course-ready headwear that can stay in the weekend rotation off the course too.';
  if (/rangefinder|gps|golf tech/i.test(text) || category === 'Golf Tech') return 'Golf technology with a clear on-course or practice use case.';
  if (/training|trainer|putting|alignment|swing|tempo|chipping/i.test(text) || category === 'Training Aids') return 'A practice tool for giving a range, putting, or at-home session a specific focus.';
  if (/game/i.test(text)) return 'A golf-group add for trips, scrambles, and the hours around the round.';
  if (price <= 35 && dailyUseCategories.includes(category)) return 'An accessible add-on with a clear place in a normal golf setup.';
  if (price <= 60) return 'A giftable golf pick under $60 with a clear use case.';
  return 'Useful golf gear selected for real rounds, trips, and better-organized bags.';
}

export function sortByQuality<T extends Product>(products: T[]) {
  return [...products].sort((a, b) => productQualityScore(b) - productQualityScore(a));
}
