/**
 * fix-mismatched-images-batch2.ts
 *
 * Replaces the 9 highest-visibility MISMATCHED product images flagged by the
 * customer (driver clubhead shown for a hat clip set, smartwatch shown for hats
 * and visors, a chipping net shown for a ball retriever, etc.).
 *
 * Root cause: scripts/fix-all-product-images.ts contains a mapping table where
 * the SAME AliExpress image URL was assigned to multiple unrelated product
 * handles. This script unconditionally replaces the featured image for the
 * handles below with NEWLY sourced, visually-verified AliExpress photos that
 * actually match each product title.
 *
 * Every URL below was downloaded and visually inspected before inclusion —
 * no placeholders, no recycled/duplicate images.
 *
 * Usage:
 *   npx tsx --env-file .env.local scripts/fix-mismatched-images-batch2.ts
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
  const json = (await res.json()) as any;
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(json).slice(0, 200)}`);
  if (json.errors?.length) throw new Error(JSON.stringify(json.errors).slice(0, 300));
  return json as T;
}

const FIXED_IMAGES: Record<string, { url: string; alt: string }> = {
  'golf-hat-clip-ball-marker-set-3-markers': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sc773ee5fc5ef422bbb3c48d0dc97122br.jpg_480x480q75.jpg',
    alt: 'Magnetic golf hat clip with ball marker attached to a cap brim',
  },
  'stretch-performance-golf-hat-low-crown': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf0c365d5b34e4daba8286e596e916e4cb.jpg_480x480q75.jpg',
    alt: 'Black low-crown stretch fit performance golf cap, front and back view',
  },
  'golf-visor-performance-stretch-fit': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf2ef867dd9284cc6b3acd7459ab95354x.jpg_480x480q75.jpg',
    alt: 'Adjustable empty-top performance golf visor in multiple colors',
  },
  '12-foot-golf-ball-retriever': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sd59f84c9fa4a4c97bcb0db32b3621594h.jpg_480x480q75.jpg',
    alt: '12-foot telescoping stainless steel golf ball retriever, compact',
  },
  'golf-ball-retriever-15-foot-telescoping': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S55d61f91a5fe4d9b8f8fafd93d2ae2dfX.jpg_480x480q75.jpg',
    alt: '15-foot telescoping golf ball retriever with cushioned scoop ring',
  },
  'golf-ball-retriever-21-foot-telescoping': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sf0945b1e61f647f69263a4f5a30f6c863.jpg_480x480q75.jpg',
    alt: '21-foot telescoping golf ball retriever fully extended on course',
  },
  'golf-ball-identification-stamp-set': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S2d4a6e7c20144c46b52bebe65555c01dE.jpg_480x480q75.jpg',
    alt: 'Waterproof golf ball identification stamper set in carry case',
  },
  'premium-golf-ball-mix-pack-12': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/S5dd6f63f6b9e462aba0111edcafb4454A.jpg_480x480q75.jpg',
    alt: 'Mixed brand recycled golf balls in a mesh carry bag, 12-pack',
  },
  'golf-ball-line-marker-stencil-kit': {
    url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sdbce8e5a79f14a69a650f41c9438133cx.jpg_480x480q75.jpg',
    alt: 'Golf ball line marker alignment stencil tool with red and blue marker pens',
  },
};

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
  console.log('🖼  WYX Golf — Mismatched Image Fix (Batch 2 / Priority 9)\n');

  const products = await getAllWyxProducts();
  const targets = products.filter((p) => FIXED_IMAGES[p.handle]);
  console.log(`Found ${targets.length} of ${Object.keys(FIXED_IMAGES).length} target products.\n`);

  let fixed = 0;
  let failed = 0;

  for (const product of targets) {
    const imageData = FIXED_IMAGES[product.handle];
    console.log(`→ Fixing: ${product.handle} (${product.title})`);
    if (product.featuredImage?.url) {
      console.log(`  Old: ${product.featuredImage.url.substring(0, 70)}...`);
    }
    console.log(`  New: ${imageData.url.substring(0, 70)}...`);

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

  const missingHandles = Object.keys(FIXED_IMAGES).filter(
    (h) => !products.some((p) => p.handle === h)
  );
  for (const h of missingHandles) {
    console.log(`  ⚠ Handle not found in store: ${h}`);
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`✅ Fixed:  ${fixed}`);
  console.log(`✗ Failed: ${failed}`);
  console.log(`⚠ Not found: ${missingHandles.length}`);
  console.log('\nImages may take 1-2 minutes to propagate on Shopify CDN.');
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
