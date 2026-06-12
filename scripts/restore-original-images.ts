/**
 * restore-original-images.ts
 *
 * Restores the original per-product seed images for products hidden by the
 * 2026-06-12 duplicate-image audit (see lib/productReadiness.ts). A bad
 * image-fix run had mapped one supplier photo to many unrelated products.
 *
 * For each handle in data/restore-image-map.json:
 *   1. Look up the product via Admin API
 *   2. Attach the original seed image via productCreateMedia
 *   3. Delete the wrong existing media so the restored image becomes featured
 *
 * DRY-RUN by default — prints the plan. Pass --apply to execute.
 * After applying, visually re-verify each image before removing handles from
 * knownImageMismatchHandles (restoration alone does not un-hide).
 *
 * Usage:
 *   npx tsx --env-file .env.local scripts/restore-original-images.ts
 *   npx tsx --env-file .env.local scripts/restore-original-images.ts --apply
 */

import { readFileSync } from 'fs';
import { shopifyAdminFetch, getUserErrors } from '../lib/shopify/adminClient';

type RestoreEntry = { file: string; imageUrl: string };

const FIND_PRODUCT = `#graphql
  query FindProductWithMedia($query: String!) {
    products(first: 1, query: $query) {
      edges { node { id handle title media(first: 10) { nodes { ... on MediaImage { id image { url } } } } } }
    }
  }`;

const CREATE_MEDIA = `#graphql
  mutation RestoreMedia($productId: ID!, $media: [CreateMediaInput!]!) {
    productCreateMedia(productId: $productId, media: $media) {
      media { ... on MediaImage { id status } }
      mediaUserErrors { field message }
    }
  }`;

const DELETE_MEDIA = `#graphql
  mutation DeleteWrongMedia($productId: ID!, $mediaIds: [ID!]!) {
    productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
      deletedMediaIds
      mediaUserErrors { field message }
    }
  }`;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const apply = process.argv.includes('--apply');
  const map: Record<string, RestoreEntry> = JSON.parse(readFileSync('data/restore-image-map.json', 'utf8'));
  const entries = Object.entries(map);
  console.log(`${apply ? 'APPLY' : 'DRY-RUN'} — ${entries.length} products to restore\n`);

  let restored = 0;
  let failed = 0;

  for (const [handle, entry] of entries) {
    try {
      const data = await shopifyAdminFetch<any>(FIND_PRODUCT, { query: `handle:${handle}` });
      const product = data?.products?.edges?.[0]?.node;
      if (!product) {
        console.log(`SKIP  ${handle} — not found in Shopify`);
        continue;
      }
      const wrongMediaIds = (product.media?.nodes || []).map((node: any) => node.id).filter(Boolean);

      if (!apply) {
        console.log(`PLAN  ${handle} — attach ${entry.imageUrl.slice(0, 60)}… then delete ${wrongMediaIds.length} wrong media`);
        continue;
      }

      const created = await shopifyAdminFetch<any>(CREATE_MEDIA, {
        productId: product.id,
        media: [{ originalSource: entry.imageUrl, mediaContentType: 'IMAGE', alt: product.title }]
      });
      const createErrors = created?.productCreateMedia?.mediaUserErrors || [];
      if (createErrors.length) throw new Error(createErrors.map((e: any) => e.message).join(', '));

      if (wrongMediaIds.length) {
        await sleep(800); // let new media register before deleting old
        const deleted = await shopifyAdminFetch<any>(DELETE_MEDIA, { productId: product.id, mediaIds: wrongMediaIds });
        const deleteErrors = deleted?.productDeleteMedia?.mediaUserErrors || [];
        if (deleteErrors.length) console.warn(`WARN  ${handle} — old media not fully removed: ${deleteErrors.map((e: any) => e.message).join(', ')}`);
      }

      restored += 1;
      console.log(`OK    ${handle}`);
      await sleep(600);
    } catch (error) {
      failed += 1;
      console.error(`FAIL  ${handle} — ${error instanceof Error ? error.message : error}`);
    }
  }

  console.log(`\n${apply ? `Restored ${restored}, failed ${failed}.` : 'Dry-run complete.'}`);
  if (apply) console.log('Next: re-verify each image visually, then remove verified handles from knownImageMismatchHandles.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
