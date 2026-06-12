/**
 * Publishes active products to the Headless sales channel so they appear on the Vercel storefront.
 */
import { shopifyAdminFetch } from '../lib/shopify/adminClient';

const PUBLICATIONS = `
  query Publications {
    publications(first: 20) {
      nodes { id name }
    }
  }
`;

const PRODUCTS = `
  query Products($cursor: String) {
    products(first: 50, after: $cursor, query: "status:active") {
      pageInfo { hasNextPage endCursor }
      nodes { id title handle }
    }
  }
`;

const PUBLISH = `
  mutation Publish($id: ID!, $input: [PublicationInput!]!) {
    publishablePublish(id: $id, input: $input) {
      userErrors { field message }
    }
  }
`;

async function main() {
  const pubs = await shopifyAdminFetch<any>(PUBLICATIONS);
  const headless = pubs.publications.nodes.find((p: { name: string }) => /headless/i.test(p.name));
  if (!headless) throw new Error('Headless publication not found. Install Headless sales channel first.');

  console.log(`📡 Publishing to: ${headless.name} (${headless.id})\n`);

  let cursor: string | null = null;
  let published = 0;
  let errors = 0;

  do {
    const data = await shopifyAdminFetch<any>(PRODUCTS, { cursor });
    const batch = data.products.nodes as Array<{ id: string; title: string; handle: string }>;

    for (const product of batch) {
      try {
        const result = await shopifyAdminFetch<any>(PUBLISH, {
          id: product.id,
          input: [{ publicationId: headless.id }]
        });
        const userErrors = result.publishablePublish?.userErrors || [];
        if (userErrors.length) {
          console.log(`⚠️  ${product.handle}: ${userErrors.map((e: any) => e.message).join(', ')}`);
          errors++;
        } else {
          console.log(`✅ ${product.handle}`);
          published++;
        }
      } catch (err) {
        console.log(`❌ ${product.handle}: ${err instanceof Error ? err.message : err}`);
        errors++;
      }
      await new Promise((r) => setTimeout(r, 200));
    }

    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
  } while (cursor);

  console.log(`\nPublished: ${published}, issues: ${errors}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});