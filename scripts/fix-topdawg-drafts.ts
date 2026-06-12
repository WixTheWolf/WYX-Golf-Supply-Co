/**
 * Backfill price + images on TopDawg draft products.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getAdminAccessToken } from '../lib/shopify/adminToken';

type Product = {
  handle: string;
  retailPrice: string;
  imageUrl: string;
  imageAlt: string;
};

async function adminFetch(query: string, variables: Record<string, unknown> = {}) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const version = process.env.SHOPIFY_API_VERSION || '2026-01';
  const token = await getAdminAccessToken();
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as any;
  if (json.errors?.length) throw new Error(JSON.stringify(json.errors).slice(0, 300));
  return json;
}

async function fixOne(p: Product) {
  const data = await adminFetch(`
    query($q: String!) {
      products(first: 1, query: $q) {
        edges {
          node {
            id handle
            featuredImage { url }
            variants(first: 1) { edges { node { id price } } }
            media(first: 5) { edges { node { id } } }
          }
        }
      }
    }
  `, { q: `handle:${p.handle}` });

  const node = data.data?.products?.edges?.[0]?.node;
  if (!node) return { handle: p.handle, status: 'missing' };

  const variantId = node.variants?.edges?.[0]?.node?.id;
  if (variantId && node.variants.edges[0].node.price !== p.retailPrice) {
    await adminFetch(`mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        userErrors { message }
      }
    }`, { productId: node.id, variants: [{ id: variantId, price: p.retailPrice }] });
  }

  if (!node.featuredImage?.url) {
    await adminFetch(`mutation($productId: ID!, $media: [CreateMediaInput!]!) {
      productCreateMedia(productId: $productId, media: $media) {
        userErrors { message }
      }
    }`, {
      productId: node.id,
      media: [{ mediaContentType: 'IMAGE', originalSource: p.imageUrl, alt: p.imageAlt }],
    });
  }

  return { handle: p.handle, status: 'fixed', price: p.retailPrice };
}

async function main() {
  const meta = JSON.parse(readFileSync(join(process.cwd(), 'data', 'topdawg-shortlist.json'), 'utf8'));
  console.log('\n🔧 Fixing TopDawg drafts (price + images)\n');
  for (const p of meta.products as Product[]) {
    const result = await fixOne(p);
    console.log(`  ${result.handle}: ${result.status}`);
    await new Promise((r) => setTimeout(r, 500));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });