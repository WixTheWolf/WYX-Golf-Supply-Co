/**
 * apply-verified-dropship-catalog.ts
 *
 * Single source of truth for WYX dropship products:
 * - Syncs verified supplier tags + internal source notes on existing SKUs
 * - Force-replaces hero images when they don't match verified catalog
 * - Seeds NEW draft/active products from data/verified-dropship-catalog.json
 *
 * Usage:
 *   npx tsx --env-file .env.local scripts/apply-verified-dropship-catalog.ts
 *   npx tsx --env-file .env.local scripts/apply-verified-dropship-catalog.ts --seed-only
 *   npx tsx --env-file .env.local scripts/apply-verified-dropship-catalog.ts --sync-only
 */

import { getAdminAccessToken } from '../lib/shopify/adminToken';
import {
  categoryToCollection,
  categoryToProductType,
  verifiedDropshipCatalog,
  type VerifiedDropshipProduct,
} from '../lib/shopify/verifiedDropshipCatalog';

const KNOWN_BAD_IMAGE_IDS = [
  'S52c568a8afdd471dbaa71255068f83efj',
  'S3a1c5b8ccbd84fbfa8f7a0647a853422Z',
];

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

function sourceId(url: string): string {
  const match = url.match(/\/kf\/(S[a-zA-Z0-9]+)/);
  return match?.[1] ?? url.split('/').pop()?.split('?')[0] ?? url;
}

function imageNeedsReplace(currentUrl: string | undefined, target: VerifiedDropshipProduct): boolean {
  if (!currentUrl) return true;
  if (KNOWN_BAD_IMAGE_IDS.some((id) => currentUrl.includes(id))) return true;
  const targetId = sourceId(target.imageUrl);
  return !currentUrl.includes(targetId);
}

function supplierNote(product: VerifiedDropshipProduct): string {
  return `<!-- wyx-supplier:${product.supplier}|${product.supplierSku}|${product.supplierUrl} -->`;
}

async function findProduct(handle: string) {
  const data = await adminFetch<any>(`
    query($q: String!) {
      products(first: 1, query: $q) {
        edges {
          node {
            id handle title status tags
            featuredImage { url }
            media(first: 5) {
              edges { node { id ... on MediaImage { id image { url } } } }
            }
          }
        }
      }
    }
  `, { q: `handle:${handle}` });
  return data.data.products.edges[0]?.node;
}

async function updateTags(productId: string, tags: string[]) {
  await adminFetch(`mutation($id: ID!, $tags: [String!]!) {
    productUpdate(product: { id: $id, tags: $tags }) {
      userErrors { message }
    }
  }`, { id: productId, tags });
}

async function replaceImage(productId: string, mediaIds: string[], image: { url: string; alt: string }) {
  if (mediaIds.length) {
    await adminFetch(`mutation($productId: ID!, $mediaIds: [ID!]!) {
      productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
        deletedMediaIds userErrors { message }
      }
    }`, { productId, mediaIds });
    await new Promise((r) => setTimeout(r, 500));
  }
  const data = await adminFetch<any>(`mutation($productId: ID!, $media: [CreateMediaInput!]!) {
    productCreateMedia(productId: $productId, media: $media) {
      userErrors { message }
    }
  }`, {
    productId,
    media: [{ mediaContentType: 'IMAGE', originalSource: image.url, alt: image.alt }],
  });
  const errors = data.data?.productCreateMedia?.userErrors ?? [];
  if (errors.length) throw new Error(errors.map((e: any) => e.message).join(', '));
}

async function createProduct(entry: VerifiedDropshipProduct) {
  const publish = entry.status === 'active' && entry.imageVerified;
  const description = [
    `<p>${entry.title} — curated for weekend golfers. Ships in ${entry.usShipDays} days to US addresses.</p>`,
    `<p><strong>Supplier:</strong> ${entry.supplier} (${entry.supplierSku})</p>`,
    supplierNote(entry),
  ].join('');

  const data = await adminFetch<any>(`mutation($product: ProductCreateInput!) {
    productCreate(product: $product) {
      product { id handle variants(first: 1) { edges { node { id } } } }
      userErrors { message }
    }
  }`, {
    product: {
      title: entry.title,
      handle: entry.handle,
      descriptionHtml: description,
      vendor: 'WYX Golf Supply Co.',
      productType: categoryToProductType(entry.category),
      tags: [...entry.tags, 'verified-dropship-catalog'],
      status: publish ? 'ACTIVE' : 'DRAFT',
    },
  });

  const errors = data.data?.productCreate?.userErrors ?? [];
  if (errors.length) throw new Error(errors.map((e: any) => e.message).join(', '));

  const product = data.data.productCreate.product;
  const variantId = product.variants.edges[0]?.node?.id;
  if (variantId) {
    await adminFetch(`mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        userErrors { message }
      }
    }`, { productId: product.id, variants: [{ id: variantId, price: entry.retailPrice }] });
  }

  await replaceImage(product.id, [], { url: entry.imageUrl, alt: entry.imageAlt });

  const collectionHandle = categoryToCollection(entry.category);
  const colData = await adminFetch<any>(`query($q: String!) {
    collections(first: 1, query: $q) { edges { node { id } } }
  }`, { q: `handle:${collectionHandle}` });
  const collectionId = colData.data.collections.edges[0]?.node?.id;
  if (collectionId) {
    await adminFetch(`mutation($id: ID!, $productIds: [ID!]!) {
      collectionAddProducts(id: $id, productIds: $productIds) { userErrors { message } }
    }`, { id: collectionId, productIds: [product.id] });
  }

  return product.handle;
}

async function syncExisting(entry: VerifiedDropshipProduct) {
  const node = await findProduct(entry.handle);
  if (!node) return { handle: entry.handle, action: 'missing' as const };

  const mergedTags = Array.from(new Set([...(node.tags || []), ...entry.tags, 'verified-dropship-catalog']));
  await updateTags(node.id, mergedTags);

  let imageAction = 'ok';
  if (imageNeedsReplace(node.featuredImage?.url, entry)) {
    const mediaIds = (node.media?.edges ?? []).map((e: any) => e.node.id).filter(Boolean);
    await replaceImage(node.id, mediaIds, { url: entry.imageUrl, alt: entry.imageAlt });
    imageAction = 'replaced';
  }

  return { handle: entry.handle, action: 'synced' as const, imageAction };
}

async function main() {
  const args = process.argv.slice(2);
  const seedOnly = args.includes('--seed-only');
  const syncOnly = args.includes('--sync-only');

  console.log('📦 WYX Verified Dropship Catalog Apply\n');
  console.log(`Catalog version: ${verifiedDropshipCatalog.updatedAt}`);
  console.log(`Products in catalog: ${verifiedDropshipCatalog.products.length}\n`);

  let synced = 0;
  let imagesFixed = 0;
  let seeded = 0;
  let skipped = 0;

  for (const entry of verifiedDropshipCatalog.products) {
    const existing = await findProduct(entry.handle);

    if (!existing && !syncOnly) {
      if (!entry.imageVerified) {
        console.log(`  ⏭  Skip seed (image not verified): ${entry.handle}`);
        skipped++;
        continue;
      }
      console.log(`  + Seed: ${entry.handle} (${entry.status})`);
      try {
        await createProduct(entry);
        seeded++;
        console.log(`    ✓ Created\n`);
      } catch (err: any) {
        console.log(`    ✗ ${err.message}\n`);
      }
      await new Promise((r) => setTimeout(r, 800));
      continue;
    }

    if (existing && !seedOnly) {
      const result = await syncExisting(entry);
      if (result.action === 'synced') {
        synced++;
        if (result.imageAction === 'replaced') imagesFixed++;
        console.log(`  ✓ Synced: ${entry.handle}${result.imageAction === 'replaced' ? ' (image replaced)' : ''}`);
      }
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Synced:       ${synced}`);
  console.log(`Images fixed: ${imagesFixed}`);
  console.log(`Seeded:       ${seeded}`);
  console.log(`Skipped:      ${skipped}`);
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});