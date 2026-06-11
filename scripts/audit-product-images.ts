import { getAdminAccessToken } from '../lib/shopify/adminToken';

interface ProductNode {
  handle: string;
  title: string;
  status: string;
  featuredImage: { url: string; altText: string | null } | null;
  images: { edges: { node: { url: string; altText: string | null } }[] };
}

async function fetchAllProducts(): Promise<ProductNode[]> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const version = process.env.SHOPIFY_API_VERSION || '2026-01';
  const token = await getAdminAccessToken();

  const products: ProductNode[] = [];
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const query = `#graphql
      query Products($cursor: String) {
        products(first: 50, after: $cursor) {
          pageInfo { hasNextPage endCursor }
          edges {
            node {
              handle
              title
              status
              featuredImage { url altText }
              images(first: 1) { edges { node { url altText } } }
            }
          }
        }
      }`;

    const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ query, variables: { cursor } }),
    });
    const json = await res.json();
    if (json.errors) {
      console.error(JSON.stringify(json.errors, null, 2));
      break;
    }
    const conn = json.data.products;
    for (const edge of conn.edges) {
      products.push(edge.node);
    }
    hasNextPage = conn.pageInfo.hasNextPage;
    cursor = conn.pageInfo.endCursor;
  }

  return products;
}

async function main() {
  const products = await fetchAllProducts();
  console.log(`Total products: ${products.length}\n`);
  for (const p of products) {
    const img = p.featuredImage?.url || 'NO IMAGE';
    console.log(`${p.handle}\t${p.status}\t${p.title}\t${img}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
