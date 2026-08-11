/**
 * Remove supplier-review only from products recorded as actually mapped in DSers.
 *
 * Usage:
 *   npm run clear:dsers-review
 *
 * Important: do not hard-code "ready" handles here. Mapping in DSers is the gate.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { shopifyAdminFetch } from '../lib/shopify/adminClient';

const FIND = `query($q: String!) {
  products(first: 1, query: $q) { nodes { id handle tags } }
}`;
const UPDATE = `mutation($id: ID!, $tags: [String!]!) {
  productUpdate(product: { id: $id, tags: $tags }) { userErrors { message } }
}`;

async function main() {
  const conn = JSON.parse(readFileSync(join(process.cwd(), 'data', 'dsers-spocket-connection.json'), 'utf8'));
  const linked: string[] = conn.dsersLinkedProducts ?? [];

  console.log(`\n🏷  Clearing supplier-review on ${linked.length} products recorded as DSers-mapped\n`);

  if (!linked.length) {
    console.log('No DSers mappings recorded. Nothing changed.\n');
    return;
  }

  for (const handle of linked) {
    const found = await shopifyAdminFetch<{ products: { nodes: Array<{ id: string; handle: string; tags: string[] }> } }>(FIND, { q: `handle:${handle}` });
    const product = found.products.nodes[0];
    if (!product) {
      console.log(`  ⚠️  ${handle}: not found`);
      continue;
    }
    if (!product.tags.includes('supplier-review')) {
      console.log(`  ✓  ${handle}: already clear`);
      continue;
    }
    const tags = product.tags.filter((tag) => tag !== 'supplier-review');
    const result = await shopifyAdminFetch<any>(UPDATE, { id: product.id, tags });
    const errors = result?.productUpdate?.userErrors || [];
    if (errors.length) {
      console.log(`  ❌ ${handle}: ${errors.map((error: any) => error.message).join(', ')}`);
      continue;
    }
    console.log(`  ✅ ${handle}: supplier-review removed`);
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  console.log('\nDone. Re-run: npm run shopify:check-storefront\n');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
