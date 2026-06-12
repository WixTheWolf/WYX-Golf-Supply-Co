/**
 * audit-product-images.ts
 *
 * Scans all WYX products and reports image/supplier readiness issues.
 *
 * Usage:
 *   npx tsx --env-file .env.local scripts/audit-product-images.ts
 */

import { getAdminAccessToken } from '../lib/shopify/adminToken';
import { getVerifiedProduct } from '../lib/shopify/verifiedDropshipCatalog';

const BAD_IMAGE_IDS = [
  'S52c568a8afdd471dbaa71255068f83efj',
  'S3a1c5b8ccbd84fbfa8f7a0647a853422Z',
];

/** Products where a GPS watch image is correct */
const WATCH_IMAGE_OK_HANDLES = new Set(['golf-gps-watch-40000-courses', 'golf-gps-watch-wyx']);

async function adminFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const version = process.env.SHOPIFY_API_VERSION || '2026-01';
  const token = await getAdminAccessToken();
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as any;
  if (json.errors?.length) throw new Error(JSON.stringify(json.errors));
  return json as T;
}

async function main() {
  const data = await adminFetch<any>(`
    query {
      products(first: 250, query: "vendor:'WYX Golf Supply Co.'") {
        edges {
          node {
            handle title status
            featuredImage { url }
            tags
          }
        }
      }
    }
  `);

  const products = data.data.products.edges.map((e: any) => e.node);
  const issues: Array<{ handle: string; flags: string[] }> = [];

  for (const p of products) {
    const flags: string[] = [];
    const url = p.featuredImage?.url ?? '';
    const tags: string[] = p.tags || [];

    if (!url) flags.push('missing-image');
    if (url.includes('unsplash.com')) flags.push('unsplash-placeholder');
    if (
      BAD_IMAGE_IDS.some((id) => url.includes(id)) &&
      !WATCH_IMAGE_OK_HANDLES.has(p.handle)
    ) {
      flags.push('known-bad-watch-image');
    }

    const verified = getVerifiedProduct(p.handle);
    if (verified) {
      const targetId = verified.imageUrl.match(/\/kf\/(S[a-zA-Z0-9]+)/)?.[1];
      if (targetId && !url.includes(targetId) && !url.includes('photo-')) {
        flags.push('image-not-matching-verified-catalog');
      }
      if (!tags.some((t) => t.startsWith('supplier-'))) flags.push('missing-supplier-tag');
    } else if (!tags.includes('supplier-review') && !tags.includes('wyx-curated')) {
      flags.push('no-verified-catalog-entry');
    }

    if (flags.length) issues.push({ handle: p.handle, flags });
  }

  console.log(`\n🔍 WYX Product Image Audit — ${products.length} products\n`);
  console.log(`Issues found: ${issues.length}\n`);

  for (const row of issues.sort((a, b) => a.handle.localeCompare(b.handle))) {
    console.log(`  ${row.handle}`);
    for (const f of row.flags) console.log(`    ⚠ ${f}`);
  }

  const clean = products.length - issues.length;
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Clean:  ${clean}`);
  console.log(`Issues: ${issues.length}`);
  console.log(`Total:  ${products.length}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});