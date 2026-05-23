import type { Product } from '@/types/shopify';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_SHOP_DOMAIN || process.env.SHOPIFY_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_STOREFRONT_API_TOKEN || process.env.PUBLIC_STOREFRONT_API_TOKEN || process.env.STOREFRONT_ACCESS_TOKEN;
const version = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || process.env.SHOPIFY_API_VERSION || '2026-01';

export const hasShopify = Boolean(domain && token);

export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!hasShopify) throw new Error('Shopify env vars missing. Demo data is active.');
  const res = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': token! },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map((e: { message: string }) => e.message).join(', '));
  return json.data;
}

export function reshapeProduct(p: any): Product {
  return { id: p.id, handle: p.handle, title: p.title, description: p.description, descriptionHtml: p.descriptionHtml, productType: p.productType, tags: p.tags || [], featuredImage: p.featuredImage, images: (p.images?.edges || []).map((e: any) => e.node), variants: (p.variants?.edges || []).map((e: any) => e.node), priceRange: p.priceRange };
}
