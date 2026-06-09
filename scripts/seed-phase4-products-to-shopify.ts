/**
 * seed-phase4-products-to-shopify.ts
 *
 * Seeds Phase 4 products to Shopify as ACTIVE listings.
 * Usage:
 *   npm run seed:phase4-products
 */

import { phase4Products } from '../lib/shopify/phase4Products';
import type { DirectProduct } from '../lib/shopify/directProducts';
import { getAdminAccessToken } from '../lib/shopify/adminToken';

type SeedResult = {
  handle: string;
  title: string;
  status: 'created' | 'exists' | 'error';
  message: string;
};

function getEnv() {
  const domain =
    process.env.SHOPIFY_STORE_DOMAIN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
    process.env.SHOPIFY_SHOP_DOMAIN ||
    process.env.SHOPIFY_DOMAIN;
  const version = process.env.SHOPIFY_API_VERSION || process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || '2026-01';
  return { domain, version };
}

async function adminFetch<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const { domain, version } = getEnv();
  if (!domain) throw new Error('Missing SHOPIFY_STORE_DOMAIN environment variable.');
  const token = await getAdminAccessToken();
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store'
  });
  const json = (await res.json()) as any;
  if (!res.ok) throw new Error(`Shopify API ${res.status}: ${JSON.stringify(json).slice(0, 200)}`);
  if (json.errors) throw new Error(JSON.stringify(json.errors).slice(0, 200));
  return json.data as T;
}

const FIND_PRODUCT = `#graphql
  query FindProduct($query: String!) {
    products(first: 1, query: $query) {
      edges { node { id handle status } }
    }
  }`;

const CREATE_PRODUCT = `#graphql
  mutation CreateProduct($product: ProductCreateInput!) {
    productCreate(product: $product) {
      product { id handle status variants(first: 1) { edges { node { id } } } }
      userErrors { field message }
    }
  }`;

const VARIANT_PRICE_UPDATE = `#graphql
  mutation VariantPriceUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants { id price }
      userErrors { field message }
    }
  }`;

const ADD_MEDIA = `#graphql
  mutation AddMedia($productId: ID!, $media: [CreateMediaInput!]!) {
    productCreateMedia(productId: $productId, media: $media) {
      media { ... on MediaImage { id status image { url } } }
      mediaUserErrors { field message }
    }
  }`;

function collectErrors(data: any): string[] {
  return Object.values(data || {}).flatMap((v: any) => (v?.userErrors || []).map((e: any) => e.message));
}

async function seedOne(product: DirectProduct, publish: boolean): Promise<SeedResult> {
  const { handle, title } = product;

  const existing = await adminFetch<any>(FIND_PRODUCT, { query: `handle:${handle}` });
  if (existing?.products?.edges?.length > 0) {
    return { handle, title, status: 'exists', message: `Already exists (${existing.products.edges[0].node.status})` };
  }

  const descriptionHtml = [
    `<p>${product.description}</p>`,
    `<h3>Details</h3><ul>${product.details.map((d) => `<li>${d}</li>`).join('')}</ul>`,
    `<h3>Materials</h3><p>${product.materials}</p>`,
    `<h3>Care</h3><p>${product.care}</p>`
  ].join('');

  const createData = await adminFetch<any>(CREATE_PRODUCT, {
    product: {
      title,
      handle,
      descriptionHtml,
      vendor: 'WYX Golf Supply Co.',
      productType: product.productType,
      tags: [...new Set([...product.tags, 'direct-catalog', 'wyx-curated'])],
      status: publish ? 'ACTIVE' : 'DRAFT',
      seo: { title: product.seoTitle, description: product.metaDescription }
    }
  });

  const createErrors = collectErrors(createData);
  if (createErrors.length) throw new Error(createErrors.join(', '));

  const createdProduct = createData?.productCreate?.product;
  if (!createdProduct?.id) throw new Error('No product ID returned from Shopify');

  const variantId = createdProduct?.variants?.edges?.[0]?.node?.id;
  if (variantId) {
    await adminFetch<any>(VARIANT_PRICE_UPDATE, {
      productId: createdProduct.id,
      variants: [{ id: variantId, price: product.price }]
    });
  }

  try {
    await adminFetch(ADD_MEDIA, {
      productId: createdProduct.id,
      media: [{ originalSource: product.imageUrl, mediaContentType: 'IMAGE', alt: product.imageAlt }]
    });
  } catch (imgErr: any) {
    console.warn(`  ⚠️  Image failed for ${handle}: ${imgErr.message?.slice(0, 80)}`);
  }

  return { handle, title, status: 'created', message: `Created ${publish ? 'ACTIVE' : 'DRAFT'}` };
}

async function main() {
  const publish = process.env.PUBLISH_DIRECT_PRODUCTS !== 'false';
  console.log(`\n🏌️  WYX Golf — Phase 4 Product Seed`);
  console.log(publish ? '🟢 Creating as ACTIVE' : '🟡 Creating as DRAFT');
  console.log(`📦 ${phase4Products.length} products\n`);

  const results: SeedResult[] = [];

  for (const product of phase4Products) {
    process.stdout.write(`  ${product.handle}... `);
    try {
      const result = await seedOne(product, publish);
      results.push(result);
      const icon = result.status === 'created' ? '✅' : result.status === 'exists' ? '♻️ ' : '❌';
      console.log(`${icon} ${result.message}`);
    } catch (e: any) {
      const msg = (e?.message || String(e)).slice(0, 120);
      results.push({ handle: product.handle, title: product.title, status: 'error', message: msg });
      console.log(`❌ ${msg}`);
    }
  }

  const created = results.filter((r) => r.status === 'created').length;
  const existing = results.filter((r) => r.status === 'exists').length;
  const errors = results.filter((r) => r.status === 'error').length;

  console.log(`\n✅ Created: ${created}  |  ♻️  Existing: ${existing}  |  ❌ Errors: ${errors}`);
  if (errors > 0) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
