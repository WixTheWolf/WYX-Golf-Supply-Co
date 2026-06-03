import { categoryFor, supplierName } from '@/lib/catalog';
import { money } from '@/lib/demo';
import { cleanText } from '@/lib/text';
import type { Product } from '@/types/shopify';

export const siteUrl = 'https://wyx-golf-supply-co.vercel.app';

export function productUrl(product: Pick<Product, 'handle'>) {
  return `${siteUrl}/products/${product.handle}`;
}

export function productPrice(product: Product) {
  const variant = product.variants.find((item) => item.availableForSale) || product.variants[0];
  return variant?.price || product.priceRange.minVariantPrice;
}

export function productPriceLabel(product: Product) {
  return money(productPrice(product));
}

export function isImpulseProduct(product: Product) {
  return Number(productPrice(product).amount) <= 60;
}

export function escapeXml(value: string | null | undefined) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function stripHtml(value: string | null | undefined) {
  return cleanText(String(value || '')
    .replace(/<\/(p|h[1-6]|li|ul|ol|div)>/gi, '. ')
    .replace(/<li[^>]*>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+\./g, '.')
    .replace(/\.{2,}/g, '.')
    .replace(/\.\s+\./g, '.'));
}

export function productDescription(product: Pick<Product, 'description' | 'descriptionHtml'>) {
  return stripHtml(product.descriptionHtml || product.description);
}

export function productFeedItem(product: Product) {
  const price = productPrice(product);
  return {
    id: product.handle,
    title: cleanText(product.title),
    description: productDescription(product),
    link: productUrl(product),
    image: product.featuredImage?.url || product.images[0]?.url || '',
    availability: product.availableForSale ? 'in stock' : 'out of stock',
    condition: 'new',
    price: `${Number(price.amount).toFixed(2)} ${price.currencyCode}`,
    brand: supplierName(product),
    productType: categoryFor(product),
    googleProductCategory: 'Sporting Goods > Outdoor Recreation > Golf'
  };
}
