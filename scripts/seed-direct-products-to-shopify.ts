/**
 * seed-direct-products-to-shopify.ts
 *
 * Seeds the 10 new directProducts to Shopify as ACTIVE listings with images.
 *
 * Usage:
 *   npx ts-node --require tsconfig-paths/register scripts/seed-direct-products-to-shopify.ts
 *
 * Products are created ACTIVE by default (they include real image URLs and pass
 * hasSaleReadyMedia() immediately after Shopify CDN-izes the attached image).
 *
 * Set PUBLISH_DIRECT_PRODUCTS=false to create as DRAFT instead.
 */

// Env vars loaded by tsx --env-file .env.local (see package.json seed:direct-products)
import { seedDirectProducts } from '../lib/shopify/directSeed';

async function main() {
  const publish = process.env.PUBLISH_DIRECT_PRODUCTS !== 'false';
  console.log(
    publish
      ? '🟢 Seeding direct products as ACTIVE — they will appear on the storefront after image processing.'
      : '🟡 Seeding direct products as DRAFT (set PUBLISH_DIRECT_PRODUCTS=false to change).'
  );

  const results = await seedDirectProducts(publish);

  console.log('\nResults:\n');
  console.table(
    results.map((r) => ({
      handle: r.handle,
      status: r.status,
      shopifyStatus: r.shopifyStatus || '',
      message: r.message.slice(0, 80)
    }))
  );

  const created = results.filter((r) => r.status === 'created');
  const existing = results.filter((r) => r.status === 'exists');
  const errors = results.filter((r) => r.status === 'error');

  console.log(`\n✅ Created: ${created.length}  |  ♻️  Existing: ${existing.length}  |  ❌ Errors: ${errors.length}`);

  if (errors.length) {
    console.error('\nFailed products:');
    errors.forEach((e) => console.error(` - ${e.handle}: ${e.message}`));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
