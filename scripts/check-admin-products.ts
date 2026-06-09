/**
 * check-admin-products.ts
 * Uses Admin API to list WYX products and their publication/availability status.
 * Usage: npx tsx --env-file .env.local scripts/check-admin-products.ts
 */
import { getAdminAccessToken } from '../lib/shopify/adminToken';

async function adminFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const version = process.env.SHOPIFY_API_VERSION || '2026-01';
  const token = await getAdminAccessToken();
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json() as any;
  if (!res.ok || json.errors) throw new Error(JSON.stringify(json.errors || json));
  return json as T;
}

async function main() {
  console.log('🔍 Checking WYX Golf Supply Co. products via Admin API...\n');

  const data = await adminFetch<any>(`
    query {
      products(first: 100, query: "vendor:'WYX Golf Supply Co.'") {
        edges {
          node {
            id handle title status
            featuredImage { url }
            variants(first: 1) { edges { node { price } } }
          }
        }
      }
    }
  `);

  const products = data.data.products.edges.map((e: any) => e.node);
  console.log(`Total WYX products in Admin: ${products.length}\n`);

  for (const p of products) {
    const img = p.featuredImage?.url ? '✓ img' : '✗ NO IMG';
    const price = p.variants?.edges?.[0]?.node?.price || '?';
    console.log(`${p.status === 'ACTIVE' ? '🟢' : '🔴'} [${p.status}] ${p.handle}`);
    console.log(`   ${img} | $${price}`);
  }

  console.log('\n\nExpected handles missing from Admin:');
  const expected = [
    'golf-laser-rangefinder-800-yard-slope',
    'putting-alignment-mirror-folding-tour',
    'golf-alignment-sticks-2-pack-fiberglass',
    'cabretta-leather-golf-glove-medium',
    'microfiber-golf-towel-dual-sided',
  ];
  const found = products.map((p: any) => p.handle);
  for (const h of expected) {
    console.log(found.includes(h) ? `  ✓ ${h}` : `  ✗ MISSING: ${h}`);
  }
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
