/**
 * fix-mismatched-images-batch3.ts
 *
 * Force-replaces the 7 popular-seller audit SKUs that still had wrong or
 * recycled AliExpress hero images (alignment sticks on tees/mirror, gloves on
 * headcover, groove tubes on brush, etc.).
 *
 * Image sources were downloaded and visually verified before inclusion.
 *
 * Usage:
 *   npx tsx --env-file .env.local scripts/fix-mismatched-images-batch3.ts
 */

import { getAdminAccessToken } from '../lib/shopify/adminToken';
import { getVerifiedProduct } from '../lib/shopify/verifiedDropshipCatalog';

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
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(json).slice(0, 200)}`);
  if (json.errors?.length) throw new Error(JSON.stringify(json.errors).slice(0, 300));
  return json as T;
}

const TARGET_HANDLES = [
  'alignment-putting-mirror',
  'bamboo-performance-golf-tees-50-pack',
  'coastal-green-driver-headcover',
  'magnetic-golf-club-brush-cleaner',
  'premium-cabretta-leather-golf-glove',
  'tri-fold-microfiber-golf-towel',
  'groove-sharpener-cleaner-tool',
] as const;

async function getAllWyxProducts() {
  const data = await adminFetch<any>(`
    query {
      products(first: 250, query: "vendor:'WYX Golf Supply Co.'") {
        edges {
          node {
            id
            handle
            title
            featuredImage { url }
            media(first: 5) {
              edges {
                node {
                  id
                  ... on MediaImage {
                    id
                    image { url }
                  }
                }
              }
            }
          }
        }
      }
    }
  `);
  return (data.data.products.edges as any[]).map((e: any) => e.node);
}

async function deleteExistingMedia(productId: string, mediaIds: string[]) {
  if (!mediaIds.length) return;
  await adminFetch<any>(
    `
    mutation($productId: ID!, $mediaIds: [ID!]!) {
      productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
        deletedMediaIds
        userErrors { field message }
      }
    }
  `,
    { productId, mediaIds }
  );
}

async function addMedia(productId: string, imageData: { url: string; alt: string }) {
  const data = await adminFetch<any>(
    `
    mutation($productId: ID!, $media: [CreateMediaInput!]!) {
      productCreateMedia(productId: $productId, media: $media) {
        media { ... on MediaImage { id image { url } } }
        userErrors { field message }
      }
    }
  `,
    {
      productId,
      media: [{ mediaContentType: 'IMAGE', originalSource: imageData.url, alt: imageData.alt }],
    }
  );

  const errors = data.data?.productCreateMedia?.userErrors ?? [];
  if (errors.length) {
    console.error(`  ✗ Media errors: ${errors.map((e: any) => e.message).join(', ')}`);
    return false;
  }
  return true;
}

async function main() {
  console.log('🖼  WYX Golf — Mismatched Image Fix (Batch 3 / Popular 7)\n');

  const products = await getAllWyxProducts();
  const targets = products.filter((p) => TARGET_HANDLES.includes(p.handle as (typeof TARGET_HANDLES)[number]));
  console.log(`Found ${targets.length} of ${TARGET_HANDLES.length} target products.\n`);

  let fixed = 0;
  let failed = 0;
  let skipped = 0;

  for (const product of targets) {
    const verified = getVerifiedProduct(product.handle);
    if (!verified) {
      console.log(`→ Skip (no catalog entry): ${product.handle}`);
      skipped++;
      continue;
    }

    const imageData = { url: verified.imageUrl, alt: verified.imageAlt };
    console.log(`→ Fixing: ${product.handle} (${product.title})`);
    if (product.featuredImage?.url) {
      console.log(`  Old: ${product.featuredImage.url.substring(0, 80)}...`);
    }
    console.log(`  New: ${imageData.url.substring(0, 80)}...`);

    const existingMediaIds = (product.media?.edges ?? [])
      .map((e: any) => e.node.id)
      .filter(Boolean);

    if (existingMediaIds.length > 0) {
      await deleteExistingMedia(product.id, existingMediaIds);
      await new Promise((r) => setTimeout(r, 600));
    }

    const ok = await addMedia(product.id, imageData);
    if (ok) {
      console.log('  ✓ Fixed!\n');
      fixed++;
    } else {
      console.log('  ✗ Failed\n');
      failed++;
    }

    await new Promise((r) => setTimeout(r, 800));
  }

  for (const h of TARGET_HANDLES) {
    if (!products.some((p) => p.handle === h)) {
      console.log(`  ⚠ Handle not found in store: ${h}`);
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Fixed:  ${fixed}`);
  console.log(`✗ Failed: ${failed}`);
  console.log(`⏭ Skipped: ${skipped}`);
  console.log('\nImages may take 1-2 minutes to propagate on Shopify CDN.');
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});