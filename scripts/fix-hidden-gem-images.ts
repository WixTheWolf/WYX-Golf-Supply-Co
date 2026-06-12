/**
 * Re-attaches product images for hidden-gem SKUs when Shopify CDN processing failed.
 */
import { hiddenGemProducts } from '../lib/shopify/hiddenGemProducts';
import { getAdminAccessToken } from '../lib/shopify/adminToken';

async function adminFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN!;
  const version = process.env.SHOPIFY_API_VERSION || '2026-01';
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': await getAdminAccessToken()
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const FIND = `query($q:String!){ products(first:1, query:$q){ edges{ node{ id handle featuredImage{ url } } } } }`;
const MEDIA = `mutation($id:ID!,$media:[CreateMediaInput!]!){ productCreateMedia(productId:$id, media:$media){ mediaUserErrors{ message } } }`;

async function main() {
  for (const product of hiddenGemProducts) {
    const data = await adminFetch<any>(FIND, { q: `handle:${product.handle}` });
    const node = data.products.edges[0]?.node;
    if (!node) {
      console.log(`⏭️  ${product.handle} — not found`);
      continue;
    }
    if (node.featuredImage?.url) {
      console.log(`✓ ${product.handle} — already has image`);
      continue;
    }
    const result = await adminFetch<any>(MEDIA, {
      id: node.id,
      media: [{ originalSource: product.imageUrl, mediaContentType: 'IMAGE', alt: product.imageAlt }]
    });
    const errs = result.productCreateMedia?.mediaUserErrors || [];
    console.log(errs.length ? `❌ ${product.handle}: ${errs[0].message}` : `✅ ${product.handle} — image attached`);
    await new Promise((r) => setTimeout(r, 800));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });