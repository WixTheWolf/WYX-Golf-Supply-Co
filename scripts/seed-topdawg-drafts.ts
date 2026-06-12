/**
 * Seeds TopDawg 8-SKU shortlist as Shopify DRAFT products.
 * Source: data/topdawg-shortlist.json
 *
 * Usage:
 *   npm run seed:topdawg-drafts
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getAdminAccessToken } from '../lib/shopify/adminToken';

type TopDawgShortlistProduct = {
  topdawgId: string;
  supplierSku: string;
  handle: string;
  title: string;
  brand: string;
  category: string;
  retailPrice: string;
  dropshipCost: number;
  msrp: number;
  score: number;
  imageUrl: string;
  imageAlt: string;
  usShipDays: string;
  tags: string[];
  migrateTo: string | null;
};

type ShortlistFile = {
  supplier: string;
  supplierUrl: string;
  wholesalePriorityNote: string;
  products: TopDawgShortlistProduct[];
};

function categoryToProductType(category: string): string {
  const map: Record<string, string> = {
    Accessories: 'Accessories',
    'Training Aids': 'Training Aids',
    'Club Care': 'Club Care',
  };
  return map[category] ?? 'Accessories';
}

function categoryToCollection(category: string): string {
  const map: Record<string, string> = {
    Accessories: 'golf-accessories',
    'Training Aids': 'training-aids',
    'Club Care': 'club-care',
  };
  return map[category] ?? 'golf-accessories';
}

function supplierNote(p: TopDawgShortlistProduct, supplierUrl: string): string {
  return `<!-- wyx-supplier:TopDawg|${p.supplierSku}|${supplierUrl}|tdid:${p.topdawgId}|cost:${p.dropshipCost} -->`;
}

async function adminFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const version = process.env.SHOPIFY_API_VERSION || '2026-01';
  const token = await getAdminAccessToken();
  const res = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await res.json()) as { data?: T; errors?: unknown };
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(json).slice(0, 200)}`);
  if (json.errors) throw new Error(JSON.stringify(json.errors).slice(0, 300));
  return json as T;
}

async function findProduct(handle: string) {
  const data = await adminFetch<any>(`
    query($q: String!) {
      products(first: 1, query: $q) {
        edges { node { id handle status tags featuredImage { url } } }
      }
    }
  `, { q: `handle:${handle}` });
  return data.data?.products?.edges?.[0]?.node;
}

async function createDraft(p: TopDawgShortlistProduct, meta: ShortlistFile) {
  const migrateNote = p.migrateTo
    ? `<p><em>Supply note: ${p.migrateTo}. ${meta.wholesalePriorityNote}</em></p>`
    : '';
  const description = [
    `<p>${p.title} — curated for weekend golfers and gift buyers. US ship estimate: ${p.usShipDays} days.</p>`,
    `<p><strong>Brand:</strong> ${p.brand} via TopDawg (audit score ${p.score}/100)</p>`,
    migrateNote,
    supplierNote(p, meta.supplierUrl),
  ].join('');

  const data = await adminFetch<any>(`
    mutation($product: ProductCreateInput!) {
      productCreate(product: $product) {
        product { id handle variants(first: 1) { edges { node { id sku } } } }
        userErrors { message }
      }
    }
  `, {
    product: {
      title: p.title,
      handle: p.handle,
      descriptionHtml: description,
      vendor: p.brand,
      productType: categoryToProductType(p.category),
      tags: [...p.tags, 'topdawg-shortlist'],
      status: 'DRAFT',
    },
  });

  const errors = data.data?.productCreate?.userErrors ?? [];
  if (errors.length) throw new Error(errors.map((e: { message: string }) => e.message).join(', '));

  const product = data.data.productCreate.product;
  const variantId = product.variants.edges[0]?.node?.id;
  if (variantId) {
    await adminFetch(`mutation($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        userErrors { message }
      }
    }`, {
      productId: product.id,
      variants: [{ id: variantId, price: p.retailPrice }],
    });
  }

  await adminFetch(`mutation($productId: ID!, $media: [CreateMediaInput!]!) {
    productCreateMedia(productId: $productId, media: $media) {
      userErrors { message }
    }
  }`, {
    productId: product.id,
    media: [{ mediaContentType: 'IMAGE', originalSource: p.imageUrl, alt: p.imageAlt }],
  });

  const colHandle = categoryToCollection(p.category);
  const colData = await adminFetch<any>(`
    query($q: String!) { collections(first: 1, query: $q) { edges { node { id } } } }
  `, { q: `handle:${colHandle}` });
  const collectionId = colData.data?.collections?.edges?.[0]?.node?.id;
  if (collectionId) {
    await adminFetch(`mutation($id: ID!, $productIds: [ID!]!) {
      collectionAddProducts(id: $id, productIds: $productIds) { userErrors { message } }
    }`, { id: collectionId, productIds: [product.id] });
  }

  return product.handle as string;
}

async function main() {
  const path = join(process.cwd(), 'data', 'topdawg-shortlist.json');
  const meta = JSON.parse(readFileSync(path, 'utf8')) as ShortlistFile;

  console.log('\n📦 TopDawg → Shopify draft import');
  console.log(`   ${meta.products.length} SKUs from data/topdawg-shortlist.json\n`);

  const results: Array<{ handle: string; status: string; message: string }> = [];

  for (const p of meta.products) {
    process.stdout.write(`  ${p.handle}... `);
    try {
      const existing = await findProduct(p.handle);
      if (existing) {
        results.push({ handle: p.handle, status: 'exists', message: existing.status });
        console.log(`exists (${existing.status})`);
        continue;
      }
      const handle = await createDraft(p, meta);
      results.push({ handle, status: 'created', message: 'DRAFT' });
      console.log('created DRAFT');
      await new Promise((r) => setTimeout(r, 600));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ handle: p.handle, status: 'error', message: msg });
      console.log(`ERROR: ${msg.slice(0, 80)}`);
    }
  }

  const created = results.filter((r) => r.status === 'created').length;
  const exists = results.filter((r) => r.status === 'exists').length;
  const errors = results.filter((r) => r.status === 'error').length;
  console.log(`\n✅ Done: ${created} created, ${exists} existed, ${errors} errors`);
  if (errors) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});