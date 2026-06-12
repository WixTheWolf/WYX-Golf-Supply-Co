/**
 * Publish QA-passed TopDawg SKUs to Headless only.
 * Reads data/topdawg-sample-order.json — requires qaPassed: true per line item.
 *
 * Usage:
 *   npm run publish:topdawg-headless
 *   npm run publish:topdawg-headless -- --all-shortlist   # all 8 after full QA
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { shopifyAdminFetch } from '../lib/shopify/adminClient';

type SampleOrder = {
  lineItems: Array<{ shopifyDraftHandle: string; qaPassed: boolean; title: string }>;
};

type PublicationsResult = { publications: { nodes: Array<{ id: string; name: string }> } };
type ProductFindResult = { products: { nodes: Array<{ id: string; handle: string; title: string; tags: string[] }> } };
type PublishResult = { publishablePublish: { userErrors: Array<{ message: string }> } };

const PUBLICATIONS = `query { publications(first: 20) { nodes { id name } } }`;
const FIND = `query($q: String!) { products(first: 1, query: $q) { nodes { id handle title tags } } }`;
const PUBLISH = `mutation($id: ID!, $input: [PublicationInput!]!) {
  publishablePublish(id: $id, input: $input) { userErrors { message } }
}`;
const TAG_UPDATE = `mutation($id: ID!, $tags: [String!]!) {
  productUpdate(product: { id: $id, tags: $tags }) { userErrors { message } }
}`;

async function main() {
  const allShortlist = process.argv.includes('--all-shortlist');
  const sample = JSON.parse(readFileSync(join(process.cwd(), 'data', 'topdawg-sample-order.json'), 'utf8')) as SampleOrder;
  const shortlist = JSON.parse(readFileSync(join(process.cwd(), 'data', 'topdawg-shortlist.json'), 'utf8')) as {
    products: Array<{ handle: string }>;
  };

  const handles = allShortlist
    ? shortlist.products.map((p) => p.handle)
    : sample.lineItems.filter((l) => l.qaPassed).map((l) => l.shopifyDraftHandle);

  if (!handles.length) {
    console.log('\n⏸️  No QA-passed SKUs to publish.');
    console.log('   Set qaPassed: true in data/topdawg-sample-order.json');
    console.log('   Or run with --all-shortlist after full QA\n');
    process.exit(0);
  }

  const pubs = await shopifyAdminFetch<PublicationsResult>(PUBLICATIONS);
  const headless = pubs.publications.nodes.find((p) => /headless/i.test(p.name));
  if (!headless) throw new Error('Headless publication not found');

  console.log(`\n📡 Publishing ${handles.length} TopDawg SKU(s) → ${headless.name}\n`);

  let published = 0;
  for (const handle of handles) {
    const found = await shopifyAdminFetch<ProductFindResult>(FIND, {
      q: `handle:${handle}`,
    });
    const product = found.products.nodes[0];
    if (!product) {
      console.log(`  ⚠️  ${handle}: not found`);
      continue;
    }

    const result = await shopifyAdminFetch<PublishResult>(PUBLISH, {
      id: product.id,
      input: [{ publicationId: headless.id }],
    });
    const errors = result.publishablePublish.userErrors;
    if (errors.length) {
      console.log(`  ⚠️  ${handle}: ${errors.map((e) => e.message).join(', ')}`);
      continue;
    }

    // Remove supplier-review gate after QA publish
    const mergedTags = Array.from(
      new Set([...product.tags.filter((t) => t !== 'supplier-review'), 'wyx-curated']),
    );
    await shopifyAdminFetch(TAG_UPDATE, { id: product.id, tags: mergedTags });

    console.log(`  ✅ ${handle}`);
    published++;
    await new Promise((r) => setTimeout(r, 300));
  }

  const connPath = join(process.cwd(), 'data', 'topdawg-connection.json');
  const conn = JSON.parse(readFileSync(connPath, 'utf8'));
  conn.headlessPublished = published > 0;
  conn.headlessPublishedAt = new Date().toISOString();
  conn.headlessPublishedCount = published;
  writeFileSync(connPath, JSON.stringify(conn, null, 2));

  console.log(`\n✅ Published ${published}/${handles.length} to Headless\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });