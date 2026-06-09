/**
 * publish-and-fix-wyx-products.ts
 *
 * 1. Finds all products with vendor = 'WYX Golf Supply Co.' in Shopify Admin
 * 2. Publishes each to the Online Store channel (so Storefront API can see them)
 * 3. Fixes known mismatched images on specific product handles
 *
 * Usage:
 *   npx tsx --env-file .env.local scripts/publish-and-fix-wyx-products.ts
 */

import { getAdminAccessToken } from '../lib/shopify/adminToken';

function getEnv() {
  const domain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    process.env.SHOPIFY_SHOP_DOMAIN ||
    process.env.SHOPIFY_DOMAIN;
  const version = process.env.SHOPIFY_API_VERSION || process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2026-01';
  if (!domain) throw new Error('Missing SHOPIFY_STORE_DOMAIN env var');
  return { domain, version };
}

async function adminFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const { domain, version } = getEnv();
  const token = await getAdminAccessToken();
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json() as any;
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(json)}`);
  if (json.errors) throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  return json as T;
}

// Correct image URLs keyed by product handle — replaces wrong/generic Unsplash images
const IMAGE_FIXES: Record<string, { url: string; alt: string }> = {
  'golf-laser-rangefinder-800-yard-slope': {
    url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200&h=900&fit=crop&q=80',
    alt: 'Golf laser rangefinder aimed at flag on golf course',
  },
  'putting-alignment-mirror-folding-tour': {
    url: 'https://images.unsplash.com/photo-1611676028867-89893e54c25c?w=1200&h=900&fit=crop&q=80',
    alt: 'Putting alignment mirror on practice putting green',
  },
  'golf-alignment-sticks-2-pack-fiberglass': {
    url: 'https://images.unsplash.com/photo-1614743007984-3e3c0e8e6e7e?w=1200&h=900&fit=crop&q=80',
    alt: 'Golf alignment sticks laid on driving range mat',
  },
  'golf-swing-speed-trainer-weighted': {
    url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&h=900&fit=crop&q=80',
    alt: 'Golfer swinging training aid on driving range',
  },
  'golf-gps-smartwatch-course-map': {
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=900&fit=crop&q=80',
    alt: 'GPS smartwatch on wrist showing course map',
  },
  'chipping-net-four-target': {
    url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&h=900&fit=crop&q=80',
    alt: 'Golf chipping net set up in backyard for practice',
  },
  'putting-mat-auto-return-9ft': {
    url: 'https://images.unsplash.com/photo-1574359411659-15573a27fd0c?w=1200&h=900&fit=crop&q=80',
    alt: 'Golf putting mat with alignment guide on office floor',
  },
};

async function getPublicationId(): Promise<string> {
  const data = await adminFetch<any>(`
    query {
      publications(first: 10) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  `);
  const pubs = data.data.publications.edges as Array<{ node: { id: string; name: string } }>;
  console.log('Available publications:', pubs.map(p => `${p.node.name} (${p.node.id})`).join(', '));
  const onlineStore = pubs.find(p => p.node.name === 'Online Store');
  if (!onlineStore) throw new Error('Could not find "Online Store" publication. Available: ' + pubs.map(p => p.node.name).join(', '));
  return onlineStore.node.id;
}

async function getWyxProducts(): Promise<Array<{ id: string; handle: string; title: string; status: string }>> {
  const products: Array<{ id: string; handle: string; title: string; status: string }> = [];
  let cursor: string | null = null;

  do {
    const data = await adminFetch<any>(`
      query($cursor: String) {
        products(first: 50, after: $cursor, query: "vendor:'WYX Golf Supply Co.'") {
          pageInfo { hasNextPage endCursor }
          edges {
            node { id handle title status }
          }
        }
      }
    `, { cursor });

    const page = data.data.products;
    for (const edge of page.edges) {
      products.push(edge.node);
    }
    cursor = page.pageInfo.hasNextPage ? page.pageInfo.endCursor : null;
  } while (cursor);

  return products;
}

async function publishProduct(productId: string, publicationId: string): Promise<boolean> {
  const data = await adminFetch<any>(`
    mutation PublishProduct($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) {
        publishable { ... on Product { handle status } }
        userErrors { field message }
      }
    }
  `, { id: productId, input: [{ publicationId }] });

  const errors = data.data?.publishablePublish?.userErrors ?? [];
  if (errors.length) {
    console.error(`  ⚠ publish errors: ${errors.map((e: any) => e.message).join(', ')}`);
    return false;
  }
  return true;
}

async function fixProductImage(productId: string, handle: string): Promise<void> {
  const fix = IMAGE_FIXES[handle];
  if (!fix) return;

  // Get current media
  const mediaData = await adminFetch<any>(`
    query($id: ID!) {
      product(id: $id) {
        media(first: 5) {
          edges { node { id } }
        }
      }
    }
  `, { id: productId });

  const existingMedia = mediaData.data?.product?.media?.edges ?? [];

  // Delete old media if any
  if (existingMedia.length > 0) {
    const mediaIds = existingMedia.map((e: any) => e.node.id);
    await adminFetch<any>(`
      mutation($productId: ID!, $mediaIds: [ID!]!) {
        productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
          deletedMediaIds
          userErrors { field message }
        }
      }
    `, { productId, mediaIds });
  }

  // Add correct image
  await adminFetch<any>(`
    mutation($productId: ID!, $media: [CreateMediaInput!]!) {
      productCreateMedia(productId: $productId, media: $media) {
        media { ... on MediaImage { image { url } } }
        userErrors { field message }
      }
    }
  `, {
    productId,
    media: [{ mediaContentType: 'IMAGE', originalSource: fix.url, alt: fix.alt }],
  });

  console.log(`  🖼  Fixed image for ${handle}`);
}

async function main() {
  console.log('🏌️  WYX Golf — Publish & Image Fix Script\n');

  // Step 1: Get Online Store publication ID
  console.log('📋 Finding Online Store publication...');
  const publicationId = await getPublicationId();
  console.log(`✓ Found: ${publicationId}\n`);

  // Step 2: Get all WYX products
  console.log('🔍 Fetching WYX Golf Supply Co. products...');
  const products = await getWyxProducts();
  console.log(`✓ Found ${products.length} products\n`);

  if (products.length === 0) {
    console.log('⚠ No WYX products found. Check that seeding ran successfully.');
    return;
  }

  // Step 3: Publish each product + fix images
  let published = 0, alreadyActive = 0, fixed = 0, errors = 0;

  for (const product of products) {
    console.log(`\n→ ${product.handle} [${product.status}]`);

    // Fix image if needed
    if (IMAGE_FIXES[product.handle]) {
      await fixProductImage(product.id, product.handle);
      fixed++;
    }

    // Publish to Online Store
    const ok = await publishProduct(product.id, publicationId);
    if (ok) {
      published++;
      console.log(`  ✓ Published to Online Store`);
    } else {
      errors++;
    }

    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n══════════════════════════════════');
  console.log(`✅ Published:    ${published}/${products.length}`);
  console.log(`🖼  Images fixed: ${fixed}`);
  console.log(`❌ Errors:       ${errors}`);
  console.log('\nProducts should appear on wyxgolfsupply.com within 5 minutes (cache revalidation).');
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
