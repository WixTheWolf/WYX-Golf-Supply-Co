import { starterProducts } from '@/lib/starterProducts';

const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const version = process.env.SHOPIFY_API_VERSION || '2026-01';

export type StarterSyncResult = {
  handle: string;
  title: string;
  status: 'created' | 'exists' | 'skipped' | 'error';
  shopifyStatus?: 'DRAFT' | 'ACTIVE';
  message: string;
};

async function adminFetch<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  if (!domain || !token) throw new Error('Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_ACCESS_TOKEN.');
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store'
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map((error: { message: string }) => error.message).join(', '));
  return json.data;
}

const FIND_PRODUCT = `#graphql
query FindProduct($query: String!) {
  products(first: 1, query: $query) { edges { node { id handle status title } } }
}`;

const PRODUCT_CREATE = `#graphql
mutation ProductCreate($product: ProductCreateInput!) {
  productCreate(product: $product) {
    product { id handle status title }
    userErrors { field message }
  }
}`;

const VARIANT_CREATE = `#graphql
mutation ProductVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
  productVariantsBulkCreate(productId: $productId, variants: $variants) {
    productVariants { id price }
    userErrors { field message }
  }
}`;

const FIND_COLLECTION = `#graphql
query FindCollection($handle: String!) { collectionByHandle(handle: $handle) { id handle title } }`;

const ADD_TO_COLLECTION = `#graphql
mutation AddToCollection($id: ID!, $productIds: [ID!]!) {
  collectionAddProducts(id: $id, productIds: $productIds) { userErrors { field message } }
}`;

function userErrors(payload: any) {
  return Object.values(payload).flatMap((value: any) => value?.userErrors || []);
}

async function addToCollection(productId: string, handle: string) {
  const data = await adminFetch<any>(FIND_COLLECTION, { handle });
  const collection = data.collectionByHandle;
  if (!collection?.id) return;
  const result = await adminFetch<any>(ADD_TO_COLLECTION, { id: collection.id, productIds: [productId] });
  const errors = userErrors(result);
  if (errors.length) throw new Error(errors.map((error: any) => error.message).join(', '));
}

export async function seedStarterProduct(product: (typeof starterProducts)[number], publish = false): Promise<StarterSyncResult> {
  if (!domain || !token) return { handle: product.handle, title: product.title, status: 'skipped', message: 'Missing Shopify Admin environment variables.' };

  try {
    const existing = await adminFetch<any>(FIND_PRODUCT, { query: `handle:${product.handle}` });
    const existingProduct = existing.products.edges[0]?.node;
    if (existingProduct) return { handle: product.handle, title: product.title, status: 'exists', shopifyStatus: existingProduct.status, message: 'Existing Shopify product found. No duplicate created.' };

    const create = await adminFetch<any>(PRODUCT_CREATE, {
      product: {
        title: product.title,
        handle: product.handle,
        descriptionHtml: `<p>${product.description}</p><h3>Details</h3><ul>${product.details.map((detail) => `<li>${detail}</li>`).join('')}</ul><h3>Materials</h3><p>${product.materials}</p><h3>Care</h3><p>${product.care}</p>`,
        vendor: 'WYX Golf Supply Co.',
        productType: product.productType,
        tags: [...product.tags, product.badge, 'starter-catalog'],
        status: publish ? 'ACTIVE' : 'DRAFT',
        seo: { title: product.seoTitle, description: product.metaDescription }
      }
    });

    const createErrors = userErrors(create);
    if (createErrors.length) throw new Error(createErrors.map((error: any) => error.message).join(', '));

    const createdProduct = create.productCreate.product;
    const variants = await adminFetch<any>(VARIANT_CREATE, {
      productId: createdProduct.id,
      variants: [{ price: product.price, optionValues: [{ name: 'Default Title', optionName: 'Title' }] }]
    });
    const variantErrors = userErrors(variants);
    if (variantErrors.length) throw new Error(variantErrors.map((error: any) => error.message).join(', '));

    await addToCollection(createdProduct.id, product.collectionHandle);
    return { handle: product.handle, title: product.title, status: 'created', shopifyStatus: publish ? 'ACTIVE' : 'DRAFT', message: publish ? 'Product created active for sale.' : 'Product created as draft for review.' };
  } catch (error) {
    return { handle: product.handle, title: product.title, status: 'error', message: error instanceof Error ? error.message : 'Unknown Shopify Admin API error.' };
  }
}

export async function seedStarterProducts(publish = false) {
  const results: StarterSyncResult[] = [];
  for (const product of starterProducts) results.push(await seedStarterProduct(product, publish));
  return results;
}
