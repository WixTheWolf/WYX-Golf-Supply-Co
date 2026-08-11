import type { MetadataRoute } from 'next';
import { availableProducts } from '@/lib/catalog';
import { landingCollections } from '@/lib/collections';
import { coreMerchProducts } from '@/lib/merchandisingFilters';
import { getProducts } from '@/lib/shopify/products';

const evergreenPages = [
  '',
  '/products',
  '/weekend-golfer-bag-upgrade-kit',
  '/golf-trip-gear',
  '/golf-gifts',
  '/golf-gifts-under-60',
  '/scramble-prizes',
  '/bachelor-party-golf-gifts',
  '/bag-essentials',
  '/bag-upgrades',
  '/golf-training-aids',
  '/golf-practice-gear',
  '/golf-tech',
  '/golf-club-care',
  '/golf-hats',
  '/golf-apparel',
  '/golf-gloves',
  '/golf-towels',
  '/golf-ball-markers',
  '/golf-headcovers',
  '/golf-bag-accessories',
  '/best-golf-accessories',
  '/the-bag-test',
  '/kits/golf-trip-kit',
  '/kits/bag-upgrade-kit',
  '/about',
  '/story',
  '/faq',
  '/shipping-returns',
  '/contact',
  '/privacy'
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://wyxgolfsupply.com';
  const products = coreMerchProducts(availableProducts(await getProducts()));
  const paths = [
    ...evergreenPages,
    ...landingCollections.map((collection) => `/collections/${collection.slug}`),
    ...products.map((product) => `/products/${product.handle}`)
  ];

  return Array.from(new Set(paths)).map((path) => ({
    url: base + path,
    lastModified: new Date()
  }));
}
