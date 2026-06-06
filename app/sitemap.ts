import type { MetadataRoute } from 'next';
import { availableProducts } from '@/lib/catalog';
import { landingCollections } from '@/lib/collections';
import { posts } from '@/lib/journal';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { getProducts } from '@/lib/shopify/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://wyxgolfsupply.com';
  const products = coreMerchProducts(availableProducts(await getProducts()));
  return ['', '/products', '/golf-gifts', '/golf-trip-gear', '/scramble-prizes', '/short-list', '/golf-gifts-under-60', '/golf-gifts-for-dad', '/fathers-day-golf-gifts', '/bag-essentials', '/bag-upgrades', '/the-roo', '/weekend-golfer', '/bachelor-party-golf-gifts', '/clean-contact-kit', '/best-golf-accessories', '/premium-golf-bags', '/popular-golf-products-2026', '/first-sale', '/deals', '/about', '/faq', '/story', '/journal', '/privacy', '/shipping-returns', '/contact', '/llms.txt', ...landingCollections.map((collection) => `/collections/${collection.slug}`), ...products.map((product) => `/products/${product.handle}`), ...posts.map((post) => `/journal/${post.slug}`)].map((path) => ({ url: base + path, lastModified: new Date() }));
}
