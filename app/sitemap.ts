import type { MetadataRoute } from 'next';
import { availableProducts } from '@/lib/catalog';
import { landingCollections } from '@/lib/collections';
import { allPosts as posts } from '@/lib/journal';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { getProducts } from '@/lib/shopify/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://wyxgolfsupply.com';
  const products = coreMerchProducts(availableProducts(await getProducts()));
  return ['', '/products', '/sell-more-places', '/golf-gifts', '/golf-trip-gear', '/scramble-prizes', '/short-list', '/golf-gifts-under-60', '/golf-gifts-for-dad', '/fathers-day-golf-gifts', '/golf-hats', '/golf-apparel', '/golf-training-aids', '/golf-tech', '/golf-gloves', '/golf-balls', '/golf-practice-gear', '/golf-gifts-under-25', '/scramble-prize-ideas', '/golf-gifts-for-women', '/best-golf-accessories-2026', '/golf-grips', '/golf-gifts-for-coworkers', '/golf-putting-mat', '/golf-travel-bag', '/best-golf-gifts-under-100', '/golf-towels', '/golf-belts', '/golf-ball-markers', '/golf-headcovers', '/golf-gift-sets', '/golf-divot-tools', '/golf-gps-watch', '/golf-sunglasses', '/golf-arm-sleeves', '/golf-gifts-for-women', '/golf-water-bottle', '/golf-rangefinder', '/golf-gifts-for-boss', '/golf-accessories-for-beginners', '/golf-tech-gifts', '/golf-gifts-for-golfers-who-have-everything', '/golf-gifts-under-150', '/golf-club-care', '/golf-gifts-for-husband', '/golf-tournament-prizes', '/golf-bag-accessories', '/golf-gifts-for-teenage-golfer', '/bag-essentials', '/bag-upgrades', '/kits/dad-gift-kit', '/kits/golf-trip-kit', '/kits/bag-upgrade-kit', '/the-roo', '/weekend-golfer', '/bachelor-party-golf-gifts', '/clean-contact-kit', '/best-golf-accessories', '/premium-golf-bags', '/popular-golf-products-2026', '/first-sale', '/deals', '/about', '/faq', '/story', '/journal', '/privacy', '/shipping-returns', '/contact', '/llms.txt', ...landingCollections.map((collection) => `/collections/${collection.slug}`), ...products.map((product) => `/products/${product.handle}`), ...posts.map((post) => `/journal/${post.slug}`)].map((path) => ({ url: base + path, lastModified: new Date() }));
}
