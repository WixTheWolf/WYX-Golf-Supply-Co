import type { Product } from '@/types/shopify';
import { imageMap, starterProducts } from '@/lib/starterProducts';

const usd = (amount: string) => ({ amount, currencyCode: 'USD' });

export { imageMap, starterProducts };

export const demoProducts: Product[] = starterProducts.map((product) => ({
  id: `demo-${product.handle}`,
  handle: product.handle,
  title: product.title,
  description: product.description,
  descriptionHtml: `<p>${product.description}</p>`,
  featuredImage: { url: product.image, altText: product.title },
  images: [
    { url: product.image, altText: product.title },
    { url: imageMap.hero, altText: 'Coastal golf at golden hour' },
    { url: imageMap.leather, altText: 'WYX golf accessory detail' }
  ],
  variants: [{ id: `demo-variant-${product.handle}`, title: 'Default Title', availableForSale: false, price: usd(product.price) }],
  priceRange: { minVariantPrice: usd(product.price) },
  tags: [product.badge, ...product.tags],
  productType: product.productType
}));

export function demoProduct(handle: string) {
  return demoProducts.find((product) => product.handle === handle) || null;
}

export function money(m: { amount: string; currencyCode: string }) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: m.currencyCode }).format(Number(m.amount));
}
