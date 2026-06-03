import { NextResponse } from 'next/server';
import { isAuthorizedAdminRequest, unauthorizedResponse } from '@/lib/adminAuth';
import { getUserErrors, shopifyAdminFetch } from '@/lib/shopify/adminClient';

export const dynamic = 'force-dynamic';

const PRODUCTS = `#graphql
query DraftProducts {
  products(first: 100, query: "status:draft") {
    nodes {
      id handle title vendor productType tags status totalInventory
      featuredImage { url }
      variants(first: 20) { nodes { price availableForSale inventoryQuantity } }
      resourcePublications(first: 20) { nodes { publication { id name } } }
    }
  }
  publications(first: 50) { nodes { id name } }
}`;

const UPDATE_PRODUCT = `#graphql
mutation ProductUpdate($product: ProductUpdateInput!) {
  productUpdate(product: $product) {
    product { id handle title status tags }
    userErrors { field message }
  }
}`;

const PUBLISH = `#graphql
mutation PublishProduct($id: ID!, $input: [PublicationInput!]!) {
  publishablePublish(id: $id, input: $input) {
    userErrors { field message }
  }
}`;

const placeholderImageNames = [
  'hero-coastal-fairway.png',
  'forest-polo-product.png',
  'journal-club-care.png',
  'journal-course-strategy.png',
  'journal-iron-practice.png',
  'leather-bag-detail.png',
  'walking-golfer-lifestyle..png'
];

function errors(payload: Record<string, any>) {
  return getUserErrors(payload).map((error: any) => error.message).filter(Boolean);
}

function minPrice(product: any) {
  const prices = product.variants.nodes.map((variant: any) => Number(variant.price)).filter(Number.isFinite);
  return prices.length ? Math.min(...prices) : Infinity;
}

function hasRealImage(product: any) {
  const url = String(product.featuredImage?.url || '').toLowerCase();
  return Boolean(url) && !placeholderImageNames.some((name) => url.includes(name));
}

function isPremiumSupplierProduct(product: any) {
  const text = [product.title, product.vendor, product.productType, ...(product.tags || [])].join(' ').toLowerCase();
  return /(golf bag|headcover|apparel|hat|skort|polo|glove|towel|marker|grip)/i.test(text);
}

function publicationIds(publications: Array<{ id: string; name: string }>) {
  return publications.filter((publication) => /online store|shop|chatgpt|microsoft copilot/i.test(publication.name)).map((publication) => publication.id);
}

async function publish(id: string, currentPublications: any, ids: string[]) {
  const existing = new Set((currentPublications?.nodes || []).map((node: any) => node.publication.id));
  const input = ids.filter((publicationId) => !existing.has(publicationId)).map((publicationId) => ({ publicationId }));
  if (!input.length) return false;
  const data = await shopifyAdminFetch<any>(PUBLISH, { id, input });
  const publishErrors = errors(data);
  if (publishErrors.length) throw new Error(publishErrors.join(', '));
  return true;
}

export async function POST(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();

  try {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') || 4);
    const maxPrice = Number(url.searchParams.get('maxPrice') || 400);
    const data = await shopifyAdminFetch<any>(PRODUCTS);
    const ids = publicationIds(data.publications.nodes);
    const candidates = data.products.nodes
      .filter((product: any) => product.status === 'DRAFT')
      .filter((product: any) => product.totalInventory > 0)
      .filter(hasRealImage)
      .filter(isPremiumSupplierProduct)
      .filter((product: any) => minPrice(product) <= maxPrice)
      .slice(0, limit);

    const published: Array<{ handle: string; title: string; minPrice: number; action: string }> = [];
    for (const product of candidates) {
      const tags = Array.from(new Set([...(product.tags || []), 'wyx-published-premium', 'wyx-marketing-ready']));
      const updated = await shopifyAdminFetch<any>(UPDATE_PRODUCT, { product: { id: product.id, status: 'ACTIVE', tags } });
      const updateErrors = errors(updated);
      if (updateErrors.length) throw new Error(`${product.title}: ${updateErrors.join(', ')}`);
      await publish(product.id, product.resourcePublications, ids);
      published.push({ handle: product.handle, title: product.title, minPrice: minPrice(product), action: 'activated-and-published' });
    }

    return NextResponse.json({ ok: true, candidates: candidates.length, published });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'Draft publishing failed.' }, { status: 500 });
  }
}
