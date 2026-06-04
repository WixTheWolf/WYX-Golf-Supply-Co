import type { MetadataRoute } from 'next';
import { availableProducts } from '@/lib/catalog';
import { landingCollections } from '@/lib/collections';
import { posts } from '@/lib/journal';
import { getProducts } from '@/lib/shopify/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://wyx-golf-supply-co.vercel.app';
  const products = availableProducts(await getProducts());
  return ['', '/products', '/golf-gifts', '/golf-gifts-under-60', '/golf-gifts-for-dad', '/fathers-day-golf-gifts', '/bag-essentials', '/weekend-golfer', '/bachelor-party-golf-gifts', '/clean-contact-kit', '/best-golf-accessories', '/premium-golf-bags', '/popular-golf-products-2026', '/first-sale', '/deals', '/about', '/faq', '/story', '/journal', '/cart', '/privacy', '/shipping-returns', '/contact', ...landingCollections.map((collection) => `/collections/${collection.slug}`), ...products.map((product) => `/products/${product.handle}`), ...posts.map((post) => `/journal/${post.slug}`)].map((path) => ({ url: base + path, lastModified: new Date() }));
}
