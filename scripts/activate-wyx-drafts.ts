import { getAdminAccessToken } from '../lib/shopify/adminToken';

const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const version = process.env.SHOPIFY_API_VERSION || '2026-01';

async function adminFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': await getAdminAccessToken()
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const PRODUCTS = `#graphql
query DraftWyxProducts($cursor: String) {
  products(first: 50, after: $cursor, query: "vendor:'WYX Golf Supply Co.' status:draft") {
    pageInfo { hasNextPage endCursor }
    edges { node { id handle featuredImage { url } } }
  }
}`;

const UPDATE = `#graphql
mutation ActivateProduct($product: ProductUpdateInput!) {
  productUpdate(product: $product) {
    userErrors { message }
  }
}`;

const PUBLISH = `#graphql
mutation PublishProduct($id: ID!, $input: [PublicationInput!]!) {
  publishablePublish(id: $id, input: $input) {
    userErrors { message }
  }
}`;

async function main() {
  const pubs = await adminFetch<{ publications: { nodes: Array<{ id: string; name: string }> } }>(
    '{ publications(first: 20) { nodes { id name } } }'
  );
  const publicationIds = pubs.publications.nodes
    .filter((publication) => /headless|online store/i.test(publication.name))
    .map((publication) => publication.id);

  let cursor: string | null = null;
  let activated = 0;

  do {
    const data = await adminFetch<{
      products: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        edges: Array<{ node: { id: string; handle: string; featuredImage: { url: string } | null } }>;
      };
    }>(PRODUCTS, { cursor });

    for (const edge of data.products.edges) {
      const product = edge.node;
      if (!product.featuredImage?.url) {
        console.log(`skip (no image): ${product.handle}`);
        continue;
      }

      await adminFetch(UPDATE, { product: { id: product.id, status: 'ACTIVE' } });
      for (const publicationId of publicationIds) {
        await adminFetch(PUBLISH, { id: product.id, input: [{ publicationId }] });
      }
      activated += 1;
      console.log(`activated: ${product.handle}`);
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    cursor = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
  } while (cursor);

  console.log(`\nActivated ${activated} draft products.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});