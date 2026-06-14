/**
 * Archive off-brand / simulator products from public catalog.
 *
 * Usage:
 *   npm run archive:non-golf
 */
import { shopifyAdminFetch } from '../lib/shopify/adminClient';

const BLOCKED = ['GolfbaysUSA'];
const BLOCKED_TERMS = /simulator|enclosure|impact screen|hitting mat|display rack/i;

const QUERY = `query($cursor: String) {
  products(first: 50, after: $cursor, query: "vendor:WYX Golf Supply Co.") {
    pageInfo { hasNextPage endCursor }
    nodes { id handle title vendor status tags }
  }
}`;

const ARCHIVE = `mutation($id: ID!) {
  productUpdate(product: { id: $id, status: ARCHIVED }) { userErrors { message } }
}`;

async function main() {
  let cursor: string | null = null;
  let archived = 0;

  console.log('\n🗄  Archiving off-brand products\n');

  do {
    const data = await shopifyAdminFetch<{
      products: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        nodes: Array<{ id: string; handle: string; title: string; vendor: string; status: string; tags: string[] }>;
      };
    }>(QUERY, { cursor });

    for (const p of data.products.nodes) {
      const text = `${p.title} ${p.handle} ${(p.tags || []).join(' ')}`;
      const blocked = BLOCKED.includes(p.vendor) || BLOCKED_TERMS.test(text);
      if (!blocked || p.status === 'ARCHIVED') continue;

      const result = await shopifyAdminFetch<{ productUpdate: { userErrors: Array<{ message: string }> } }>(ARCHIVE, { id: p.id });
      const errors = result.productUpdate.userErrors;
      if (errors.length) console.log(`  ⚠️  ${p.handle}: ${errors.map((e) => e.message).join(', ')}`);
      else {
        console.log(`  ✅ Archived: ${p.handle}`);
        archived++;
      }
      await new Promise((r) => setTimeout(r, 350));
    }

    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
  } while (cursor);

  console.log(`\n✅ Archived ${archived} products\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});