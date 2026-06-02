import type { MetadataRoute } from 'next';
import { posts } from '@/lib/journal';
import { getProducts } from '@/lib/shopify/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://wyx-golf-supply-co.vercel.app';
  const products = await getProducts();
  return ['', '/products', '/deals', '/story', '/journal', '/cart', '/privacy', '/shipping-returns', '/contact', ...products.map((product) => `/products/${product.handle}`), ...posts.map((post) => `/journal/${post.slug}`)].map((path) => ({ url: base + path, lastModified: new Date() }));
}
