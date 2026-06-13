/**
 * Remove supplier-review tag from DSers-linked products ready to sell.
 *
 * Usage:
 *   npm run clear:dsers-review
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

const READY_HANDLES = [
  'bamboo-performance-golf-tees-50-pack',
  'tri-fold-microfiber-golf-towel',
  'groove-sharpener-cleaner-tool',
  'magnetic-golf-club-brush-cleaner',
  'golf-hat-clip-ball-marker-set-3-markers',
  'stroke-counter-wristband',
  'premium-cabretta-leather-golf-glove',
];

async function main() {
  const conn = JSON.parse(readFileSync(join(process.cwd(), 'data', 'dsers-spocket-connection.json'), 'utf8'));
  const linked: string[] = conn.dsersLinkedProducts ?? [];
  const handles = Array.from(new Set([...READY_HANDLES, ...linked]));

  console.log(`\n🏷  Clearing supplier-review on ${handles.length} DSers-ready SKUs\n`);

  for (const handle of handles) {
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
    const tags = product.tags.filter((t) => t !== 'supplier-review');
    await shopifyAdminFetch(UPDATE, { id: product.id, tags });
    console.log(`  ✅ ${handle}: supplier-review removed`);
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log('\nDone. Re-run: npm run shopify:check-storefront\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});