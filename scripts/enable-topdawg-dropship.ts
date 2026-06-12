/**
 * Prepare TopDawg SKUs for dropship: inventoryPolicy CONTINUE only.
 * Does NOT publish to Headless (sample QA gate).
 */
import { shopifyAdminFetch } from '../lib/shopify/adminClient';

const PRODUCTS = `#graphql
query TopDawgProducts($cursor: String) {
  products(first: 20, after: $cursor, query: "tag:topdawg-shortlist status:active") {
    pageInfo { hasNextPage endCursor }
    nodes {
      id handle
      variants(first: 5) { nodes { id inventoryPolicy sku } }
    }
  }
}`;

const UPDATE = `#graphql
mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
  productVariantsBulkUpdate(productId: $productId, variants: $variants) {
    userErrors { message }
  }
}`;

async function main() {
  const data = await shopifyAdminFetch<{
    products: {
      nodes: Array<{ id: string; handle: string; variants: { nodes: Array<{ id: string; inventoryPolicy: string; sku: string }> } }>;
    };
  }>(PRODUCTS, { cursor: null });

  console.log('\n📦 Enabling TopDawg dropship policy (CONTINUE)\n');
  let updated = 0;

  for (const product of data.products.nodes) {
    const needs = product.variants.nodes.filter((v) => v.inventoryPolicy !== 'CONTINUE');
    if (!needs.length) {
      console.log(`  ${product.handle}: already CONTINUE`);
      continue;
    }
    const result = await shopifyAdminFetch<{ productVariantsBulkUpdate: { userErrors: Array<{ message: string }> } }>(UPDATE, {
      productId: product.id,
      variants: needs.map((v) => ({ id: v.id, inventoryPolicy: 'CONTINUE' })),
    });
    const errors = result.productVariantsBulkUpdate.userErrors;
    if (errors.length) console.log(`  ${product.handle}: ${errors.map((e) => e.message).join(', ')}`);
    else {
      console.log(`  ${product.handle}: CONTINUE (${needs.map((v) => v.sku || 'no-sku').join(', ')})`);
      updated += needs.length;
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n✅ ${updated} variants set to CONTINUE`);
  console.log('   Inventory sync comes from TopDawg Import List after mapping.\n');
}

main().catch((e) => { console.error(e); process.exit(1); });