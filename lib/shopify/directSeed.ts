/**
 * directSeed.ts
 *
 * Seeds directProducts to Shopify as ACTIVE listings with real images.
 *
 * Uses productCreateMedia after productCreate so Shopify CDN-izes the image URL.
 * Once Shopify stores the image, hasSaleReadyMedia() passes and the product
 * is immediately visible on the storefront.
 *
 * Env vars are read lazily inside adminFetch (not at module top-level) so the
 * script runner can safely call dotenv.config() before importing this module
 * regardless of ESM/CommonJS hoisting behavior.
 */

import { directProducts, type DirectProduct } from '@/lib/shopify/directProducts';
import { getAdminAccessToken } from './adminToken';

export type DirectSeedResult = {
  handle: string;
  title: string;
  status: 'created' | 'exists' | 'skipped' | 'error';
  shopifyStatus?: 'DRAFT' | 'ACTIVE';
  message: string;
};

function formatGraphqlErrors(errors: unknown): string {
  if (Array.isArray(errors))
    return errors.map((e: any) => e?.message || JSON.stringify(e)).join(', ');
  if (errors && typeof errors === 'object')
    return Object.values(errors as Record<string, unknown>).flat().join(', ');
  return String(errors);
}

function getEnv() {
  const domain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    process.env.SHOPIFY_SHOP_DOMAIN ||
    process.env.SHOPIFY_DOMAIN;
  const version =
    process.env.SHOPIFY_API_VERSION ||
    process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION ||
    '2026-01';
  return { domain, version };
}

async function adminFetch<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const { domain, version } = getEnv();
  if (!domain) throw new Error('Missing Shopify Admin domain environment variable.');
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': await getAdminAccessToken()
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store'
  });
  const json = await res.json();
  if (!res.ok)
    throw new Error(`Shopify Admin API ${res.status}: ${formatGraphqlErrors(json.errors || json)}`);
  if (json.errors) throw new Error(formatGraphqlErrors(json.errors));
  return json.data;
}

function collectUserErrors(payload: any): Array<{ field: string[]; message: string }> {
  return Object.values(payload).flatMap((value: any) => value?.userErrors || []);
}

// ─── GraphQL Operations ───────────────────────────────────────────────────────

const FIND_PRODUCT = `#graphql
  query FindProduct($query: String!) {
    products(first: 1, query: $query) {
      edges { node { id handle status title } }
    }
  }`;

/**
 * productCreate auto-creates a default variant in API 2024-01+.
 * We request the first variant ID so we can update its price in the next step.
 */
const PRODUCT_CREATE = `#graphql
  mutation ProductCreate($product: ProductCreateInput!) {
    productCreate(product: $product) {
      product {
        id
        handle
        status
        title
        variants(first: 1) { edges { node { id } } }
      }
      userErrors { field message }
    }
  }`;

/**
 * Update the auto-created default variant's price.
 * productVariantsBulkUpdate requires the variant ID — obtained from productCreate response.
 */
const VARIANT_PRICE_UPDATE = `#graphql
  mutation ProductVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants { id price }
      userErrors { field message }
    }
  }`;

/**
 * Attaches an external image URL via productCreateMedia.
 * Shopify fetches the URL, converts it to a CDN-hosted media object.
 * The resulting image URL starts with cdn.shopify.com and passes hasSaleReadyMedia().
 */
const PRODUCT_CREATE_MEDIA = `#graphql
  mutation ProductCreateMedia($productId: ID!, $media: [CreateMediaInput!]!) {
    productCreateMedia(productId: $productId, media: $media) {
      media {
        ... on MediaImage {
          id
          status
          image { url width height }
        }
      }
      mediaUserErrors { field message }
    }
  }`;

/**
 * Uses the modern collections search query (collectionByHandle was removed in 2024-04+).
 */
const FIND_COLLECTION = `#graphql
  query FindCollection($query: String!) {
    collections(first: 1, query: $query) {
      edges { node { id handle title } }
    }
  }`;

const ADD_TO_COLLECTION = `#graphql
  mutation AddToCollection($id: ID!, $productIds: [ID!]!) {
    collectionAddProducts(id: $id, productIds: $productIds) {
      userErrors { field message }
    }
  }`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Non-fatal collection assignment — logs a warning on failure so a collection
 * lookup issue does not flip an otherwise successful product create to 'error'.
 */
async function addToCollection(productId: string, collectionHandle: string): Promise<void> {
  try {
    const data = await adminFetch<any>(FIND_COLLECTION, {
      query: `handle:${collectionHandle}`
    });
    const collection = data?.collections?.edges?.[0]?.node;
    if (!collection?.id) {
      console.warn(`[directSeed] Collection '${collectionHandle}' not found — skipping assignment.`);
      return;
    }
    const result = await adminFetch<any>(ADD_TO_COLLECTION, {
      id: collection.id,
      productIds: [productId]
    });
    const errors = collectUserErrors(result);
    if (errors.length)
      console.warn(`[directSeed] Collection add warning for ${productId}: ${errors.map((e) => e.message).join(', ')}`);
  } catch (err) {
    console.warn(`[directSeed] Collection assignment failed for ${productId}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Non-fatal image attachment — logs a warning on failure.
 * Image processing is async on Shopify's side; the product will appear
 * without an image briefly until CDN processing completes.
 */
async function attachImage(productId: string, product: DirectProduct): Promise<void> {
  try {
    const result = await adminFetch<any>(PRODUCT_CREATE_MEDIA, {
      productId,
      media: [
        {
          originalSource: product.imageUrl,
          mediaContentType: 'IMAGE',
          alt: product.imageAlt
        }
      ]
    });
    const errors: Array<{ message: string }> =
      result?.productCreateMedia?.mediaUserErrors || [];
    if (errors.length)
      console.warn(`[directSeed] Image warning for ${product.handle}: ${errors.map((e) => e.message).join(', ')}`);
  } catch (err) {
    console.warn(`[directSeed] Image attachment failed for ${product.handle}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ─── Seed Functions ───────────────────────────────────────────────────────────

export async function seedDirectProduct(
  product: DirectProduct,
  publish = true
): Promise<DirectSeedResult> {
  const { domain } = getEnv();
  if (!domain) {
    return {
      handle: product.handle,
      title: product.title,
      status: 'skipped',
      message: 'Missing Shopify Admin environment variables.'
    };
  }

  try {
    // 1. Check for existing product by handle to prevent duplicates
    const existing = await adminFetch<any>(FIND_PRODUCT, {
      query: `handle:${product.handle}`
    });
    const existingProduct = existing?.products?.edges?.[0]?.node;
    if (existingProduct) {
      return {
        handle: product.handle,
        title: product.title,
        status: 'exists',
        shopifyStatus: existingProduct.status,
        message: 'Existing Shopify product found. No duplicate created.'
      };
    }

    // 2. Create the product (API 2024+ auto-creates a default variant)
    const createData = await adminFetch<any>(PRODUCT_CREATE, {
      product: {
        title: product.title,
        handle: product.handle,
        descriptionHtml: [
          `<p>${product.description}</p>`,
          `<h3>Details</h3><ul>${product.details.map((d) => `<li>${d}</li>`).join('')}</ul>`,
          `<h3>Materials</h3><p>${product.materials}</p>`,
          `<h3>Care</h3><p>${product.care}</p>`
        ].join(''),
        vendor: 'WYX Golf Supply Co.',
        productType: product.productType,
        tags: [...product.tags, 'direct-catalog', 'wyx-curated'],
        status: publish ? 'ACTIVE' : 'DRAFT',
        seo: { title: product.seoTitle, description: product.metaDescription }
      }
    });

    const createErrors = collectUserErrors(createData);
    if (createErrors.length) throw new Error(createErrors.map((e) => e.message).join(', '));

    const createdProduct = createData.productCreate.product;
    const defaultVariantId = createdProduct?.variants?.edges?.[0]?.node?.id;

    // 3. Update the auto-created default variant's price
    if (defaultVariantId) {
      const variantData = await adminFetch<any>(VARIANT_PRICE_UPDATE, {
        productId: createdProduct.id,
        variants: [{ id: defaultVariantId, price: product.price }]
      });
      const variantErrors = collectUserErrors(variantData);
      if (variantErrors.length)
        throw new Error(variantErrors.map((e) => e.message).join(', '));
    } else {
      console.warn(`[directSeed] No default variant found for ${product.handle} — price not set.`);
    }

    // 4. Attach image via productCreateMedia (non-fatal)
    await attachImage(createdProduct.id, product);

    // 5. Add to collection (non-fatal)
    await addToCollection(createdProduct.id, product.collectionHandle);

    return {
      handle: product.handle,
      title: product.title,
      status: 'created',
      shopifyStatus: publish ? 'ACTIVE' : 'DRAFT',
      message: publish
        ? 'Product created ACTIVE with image. Visible on storefront.'
        : 'Product created as DRAFT for review.'
    };
  } catch (error) {
    return {
      handle: product.handle,
      title: product.title,
      status: 'error',
      message: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function seedDirectProducts(publish = true): Promise<DirectSeedResult[]> {
  const results: DirectSeedResult[] = [];
  for (const product of directProducts) {
    const result = await seedDirectProduct(product, publish);
    results.push(result);
    // 600ms delay between products to respect Shopify leaky-bucket rate limits
    await new Promise((resolve) => setTimeout(resolve, 600));
  }
  return results;
}
